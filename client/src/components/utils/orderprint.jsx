import JsBarcode from 'jsbarcode';
import { Buffer } from 'buffer';

/**
 * Thermal Printer Service for 80mm thermal printers via Bluetooth
 * Handles order receipt printing with barcodes
 */

class ThermalPrinterService {
  constructor() {
    this.device = null;
    this.server = null;
    this.service = null;
    this.characteristic = null;
    this.isConnected = false;
    
    // Common service UUIDs for thermal printers
    this.PRINTER_SERVICE_UUID = '000018f0-0000-1000-8000-00805f9b34fb';
    this.PRINTER_CHARACTERISTIC_UUID = '00002af1-0000-1000-8000-00805f9b34fb';
  }

  /**
   * Check if Web Bluetooth is supported
   */
  isSupported() {
    return 'bluetooth' in navigator && 'requestDevice' in navigator.bluetooth;
  }

  /**
   * Connect to thermal printer via Bluetooth
   */
  async connect() {
    try {
      if (!this.isSupported()) {
        throw new Error('Web Bluetooth is not supported in this browser');
      }

      console.log('Requesting Bluetooth thermal printer...');
      
      // Request device - try different approaches for thermal printers
      this.device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          this.PRINTER_SERVICE_UUID,
          '000018f0-0000-1000-8000-00805f9b34fb', // Generic printer service
          '0000180f-0000-1000-8000-00805f9b34fb', // Battery service (often available)
          '00001101-0000-1000-8000-00805f9b34fb', // Serial port profile
        ]
      });

      console.log('Thermal printer found:', this.device.name);

      // Add disconnection listener
      this.device.addEventListener('gattserverdisconnected', () => {
        console.log('Thermal printer disconnected');
        this.isConnected = false;
      });

      // Connect to GATT server
      this.server = await this.device.gatt.connect();
      console.log('Connected to thermal printer GATT server');

      try {
        // Try to get the printer service
        this.service = await this.server.getPrimaryService(this.PRINTER_SERVICE_UUID);
        this.characteristic = await this.service.getCharacteristic(this.PRINTER_CHARACTERISTIC_UUID);
      } catch (serviceError) {
        console.warn('Primary printer service not found, trying alternative approach');
        
        // Alternative: Use any available service with write capability
        const services = await this.server.getPrimaryServices();
        for (const service of services) {
          try {
            const characteristics = await service.getCharacteristics();
            for (const char of characteristics) {
              if (char.properties.write || char.properties.writeWithoutResponse) {
                this.service = service;
                this.characteristic = char;
                console.log('Found writable characteristic:', char.uuid);
                break;
              }
            }
            if (this.characteristic) break;
          } catch (charError) {
            console.warn('Error checking service characteristics:', charError);
          }
        }
      }

      if (!this.characteristic) {
        throw new Error('No writable characteristic found on thermal printer');
      }

      this.isConnected = true;
      console.log('✅ Thermal printer connected successfully');
      return true;

    } catch (error) {
      console.error('❌ Thermal printer connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Send raw data to thermal printer
   */
  async sendData(data) {
    if (!this.isConnected || !this.characteristic) {
      throw new Error('Thermal printer not connected');
    }

    try {
      // Convert data to Uint8Array if it's not already
      const buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
      
      // Split large data into chunks (thermal printers have limited buffer)
      const chunkSize = 20; // Conservative chunk size for Bluetooth LE
      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.slice(i, i + chunkSize);
        
        if (this.characteristic.properties.writeWithoutResponse) {
          await this.characteristic.writeValueWithoutResponse(chunk);
        } else {
          await this.characteristic.writeValue(chunk);
        }
        
        // Small delay between chunks to prevent buffer overflow
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    } catch (error) {
      console.error('Error sending data to thermal printer:', error);
      throw error;
    }
  }

  /**
   * Disconnect from thermal printer
   */
  async disconnect() {
    try {
      if (this.device && this.device.gatt.connected) {
        await this.device.gatt.disconnect();
      }
      this.isConnected = false;
      console.log('Thermal printer disconnected');
    } catch (error) {
      console.error('Error disconnecting thermal printer:', error);
    }
  }

  /**
   * Generate ESC/POS commands for thermal printer
   */
  generateESCPOSCommands() {
    return {
      // Printer initialization
      init: [0x1B, 0x40], // ESC @
      
      // Text formatting
      bold: [0x1B, 0x45, 0x01], // ESC E 1
      boldOff: [0x1B, 0x45, 0x00], // ESC E 0
      
      // Text alignment
      alignLeft: [0x1B, 0x61, 0x00], // ESC a 0
      alignCenter: [0x1B, 0x61, 0x01], // ESC a 1
      alignRight: [0x1B, 0x61, 0x02], // ESC a 2
      
      // Text size
      normalSize: [0x1B, 0x21, 0x00], // ESC ! 0
      doubleWidth: [0x1B, 0x21, 0x20], // ESC ! 32
      doubleHeight: [0x1B, 0x21, 0x10], // ESC ! 16
      doubleSize: [0x1B, 0x21, 0x30], // ESC ! 48
      
      // Line spacing
      lineSpacing: [0x1B, 0x33, 0x20], // ESC 3 32 (normal line spacing)
      
      // Paper cutting
      cut: [0x1D, 0x56, 0x00], // GS V 0 (full cut)
      partialCut: [0x1D, 0x56, 0x01], // GS V 1 (partial cut)
      
      // Line feeds
      lf: [0x0A], // Line feed
      crlf: [0x0D, 0x0A], // Carriage return + Line feed
      
      // Paper feed
      paperFeed: [0x1B, 0x64, 0x03], // ESC d 3 (feed 3 lines)
    };
  }

  /**
   * Convert text to bytes
   */
  textToBytes(text) {
    return new TextEncoder().encode(text);
  }

  /**
   * Generate barcode image as bytes for thermal printer
   */
  generateBarcodeBytes(data, options = {}) {
    try {
      // Create a temporary canvas for barcode generation
      const canvas = document.createElement('canvas');
      
      // Configure barcode options
      const barcodeOptions = {
        format: options.format || 'CODE128',
        width: options.width || 2,
        height: options.height || 50,
        displayValue: options.displayValue !== false,
        fontSize: options.fontSize || 12,
        margin: options.margin || 10,
        ...options
      };
      
      // Generate barcode
      JsBarcode(canvas, data, barcodeOptions);
      
      // Convert canvas to thermal printer format
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Convert to monochrome bitmap for thermal printer
      const width = canvas.width;
      const height = canvas.height;
      const bytesPerLine = Math.ceil(width / 8);
      const bitmapData = [];
      
      // ESC/POS bitmap command header
      bitmapData.push(0x1B, 0x2A, 0x00); // ESC * 0 (8-dot single-density)
      bitmapData.push(width & 0xFF, (width >> 8) & 0xFF); // Width in little-endian
      
      // Convert pixels to bitmap
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < bytesPerLine; x++) {
          let byte = 0;
          for (let bit = 0; bit < 8; bit++) {
            const pixelX = x * 8 + bit;
            if (pixelX < width) {
              const pixelIndex = (y * width + pixelX) * 4;
              const brightness = (imageData.data[pixelIndex] + 
                                imageData.data[pixelIndex + 1] + 
                                imageData.data[pixelIndex + 2]) / 3;
              if (brightness < 128) { // Dark pixel
                byte |= (1 << (7 - bit));
              }
            }
          }
          bitmapData.push(byte);
        }
      }
      
      return new Uint8Array(bitmapData);
    } catch (error) {
      console.error('Error generating barcode bytes:', error);
      throw error;
    }
  }

  /**
   * Print order receipt with barcode
   */
  async printOrderReceipt(orderData) {
    if (!this.isConnected) {
      throw new Error('Thermal printer not connected');
    }

    try {
      const commands = this.generateESCPOSCommands();
      const receiptData = [];

      // Initialize printer
      receiptData.push(...commands.init);

      // Header - Company name
      receiptData.push(...commands.alignCenter);
      receiptData.push(...commands.doubleWidth);
      receiptData.push(...commands.bold);
      receiptData.push(...this.textToBytes('BizSolution'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.normalSize);
      receiptData.push(...commands.boldOff);
      receiptData.push(...this.textToBytes('Employee Meal Order'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.crlf);

      // Order details
      receiptData.push(...commands.alignLeft);
      receiptData.push(...commands.bold);
      receiptData.push(...this.textToBytes(`Order ID: ${orderData.orderId}`));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.boldOff);
      
      receiptData.push(...this.textToBytes(`Employee: ${orderData.username}`));
      receiptData.push(...commands.crlf);
      
      receiptData.push(...this.textToBytes(`Date: ${orderData.orderDate}`));
      receiptData.push(...commands.crlf);
      
      receiptData.push(...this.textToBytes(`Time: ${orderData.orderTime}`));
      receiptData.push(...commands.crlf);
      
      receiptData.push(...this.textToBytes(`Meal Type: ${orderData.mealType}`));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.crlf);

      // Separator line
      receiptData.push(...this.textToBytes('--------------------------------'));
      receiptData.push(...commands.crlf);

      // Order items
      receiptData.push(...commands.bold);
      receiptData.push(...this.textToBytes('ORDERED ITEMS:'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.boldOff);
      
      orderData.items.forEach(item => {
        receiptData.push(...this.textToBytes(`${item.name} x${item.quantity}`));
        receiptData.push(...commands.crlf);
        receiptData.push(...this.textToBytes(`  Price: Rs. ${item.price.toFixed(2)}`));
        receiptData.push(...commands.crlf);
      });

      // Total
      receiptData.push(...commands.crlf);
      receiptData.push(...this.textToBytes('--------------------------------'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.bold);
      receiptData.push(...this.textToBytes(`TOTAL: Rs. ${orderData.totalPrice.toFixed(2)}`));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.boldOff);
      receiptData.push(...commands.crlf);

      // Barcode section
      receiptData.push(...commands.alignCenter);
      receiptData.push(...this.textToBytes('Order Barcode:'));
      receiptData.push(...commands.crlf);

      // Generate and add barcode
      try {
        const barcodeBytes = this.generateBarcodeBytes(orderData.orderId, {
          width: 2,
          height: 60,
          displayValue: true,
          fontSize: 10
        });
        receiptData.push(...barcodeBytes);
        receiptData.push(...commands.crlf);
      } catch (barcodeError) {
        console.warn('Failed to generate barcode, using text fallback:', barcodeError);
        receiptData.push(...this.textToBytes(`[${orderData.orderId}]`));
        receiptData.push(...commands.crlf);
      }

      // Footer
      receiptData.push(...commands.crlf);
      receiptData.push(...this.textToBytes('Thank you for your order!'));
      receiptData.push(...commands.crlf);
      receiptData.push(...this.textToBytes('Please present this receipt'));
      receiptData.push(...commands.crlf);
      receiptData.push(...this.textToBytes('when collecting your meal.'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.crlf);

      // Paper feed and cut
      receiptData.push(...commands.paperFeed);
      receiptData.push(...commands.partialCut);

      // Send to printer
      await this.sendData(new Uint8Array(receiptData));
      
      console.log('✅ Order receipt printed successfully');
      return true;

    } catch (error) {
      console.error('❌ Failed to print order receipt:', error);
      throw error;
    }
  }
}

/**
 * Order Receipt Printer Component
 */
class OrderReceiptPrinter {
  constructor() {
    this.thermalPrinter = new ThermalPrinterService();
  }

  /**
   * Connect to thermal printer
   */
  async connectPrinter() {
    try {
      await this.thermalPrinter.connect();
      return true;
    } catch (error) {
      console.error('Failed to connect to thermal printer:', error);
      throw error;
    }
  }

  /**
   * Print order receipt
   */
  async printOrder(orderDetails) {
    try {
      // Ensure printer is connected
      if (!this.thermalPrinter.isConnected) {
        await this.connectPrinter();
      }

      // Format order data for printing
      const orderData = this.formatOrderData(orderDetails);
      
      // Print the receipt
      await this.thermalPrinter.printOrderReceipt(orderData);
      
      return true;
    } catch (error) {
      console.error('Failed to print order:', error);
      throw error;
    }
  }

  /**
   * Format order data for printing
   */
  formatOrderData(orderDetails) {
    const {
      orderId,
      username,
      orderDate,
      orderTime,
      mealType,
      items,
      totalPrice
    } = orderDetails;

    return {
      orderId: orderId || `ORD${Date.now()}`,
      username: username || 'Guest',
      orderDate: orderDate || new Date().toLocaleDateString('en-IN'),
      orderTime: orderTime || new Date().toLocaleTimeString('en-IN'),
      mealType: mealType || 'Unknown',
      items: items || [],
      totalPrice: totalPrice || 0
    };
  }

  /**
   * Disconnect from thermal printer
   */
  async disconnect() {
    await this.thermalPrinter.disconnect();
  }

  /**
   * Test printer connectivity
   */
  async testPrint() {
    try {
      if (!this.thermalPrinter.isConnected) {
        await this.connectPrinter();
      }

      const testOrder = {
        orderId: 'TEST001',
        username: 'Test User',
        orderDate: new Date().toLocaleDateString('en-IN'),
        orderTime: new Date().toLocaleTimeString('en-IN'),
        mealType: 'Test Meal',
        items: [
          { name: 'Test Item 1', quantity: 1, price: 10.00 },
          { name: 'Test Item 2', quantity: 2, price: 15.00 }
        ],
        totalPrice: 40.00
      };

      await this.thermalPrinter.printOrderReceipt(testOrder);
      console.log('✅ Test print completed successfully');
      return true;
    } catch (error) {
      console.error('❌ Test print failed:', error);
      throw error;
    }
  }
}

// Export for use in React components
export default OrderReceiptPrinter;
export { ThermalPrinterService };
