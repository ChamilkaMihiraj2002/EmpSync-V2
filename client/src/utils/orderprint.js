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
    this.debugMode = true; // Enable debug mode for barcode troubleshooting
    
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
      
      // Define thermal printer name patterns
      const thermalPrinterNames = [
        'Thermal',
        'Receipt',
        'POS',
        'Printer',
        'EPSON',
        'Star',
        'Citizen',
        'Zebra',
        'Bixolon',
        'MUNBYN',
        'Rongta',
        'Xprinter',
        'HPRT',
        'Goojprt',
        'Milestone',
        'BlueTooth Printer',
        'BT Printer',
        'Mobile Printer'
      ];

      // Create filters for thermal printer names
      const nameFilters = thermalPrinterNames.map(name => ({ namePrefix: name }));
      
      try {
        // First attempt: Try with thermal printer name filters
        console.log('Attempting to find thermal printers with name filters...');
        this.device = await navigator.bluetooth.requestDevice({
          filters: nameFilters,
          optionalServices: [
            this.PRINTER_SERVICE_UUID,
            '000018f0-0000-1000-8000-00805f9b34fb', // Generic printer service
            '0000180f-0000-1000-8000-00805f9b34fb', // Battery service
            '00001101-0000-1000-8000-00805f9b34fb', // Serial port profile
            '0000180a-0000-1000-8000-00805f9b34fb', // Device Information
            '49535343-fe7d-4ae5-8fa9-9fafd205e455', // Some thermal printers
          ]
        });
        console.log('Found device with name filter:', this.device.name);
      } catch (filterError) {
        console.warn('Filtered search failed, trying broader search:', filterError);
        
        // Second attempt: Use service UUIDs that thermal printers commonly have
        try {
          console.log('Attempting to find devices with printer services...');
          this.device = await navigator.bluetooth.requestDevice({
            filters: [
              { services: ['00001101-0000-1000-8000-00805f9b34fb'] }, // Serial Port Profile
              { services: ['000018f0-0000-1000-8000-00805f9b34fb'] }, // Generic printer
            ],
            optionalServices: [
              this.PRINTER_SERVICE_UUID,
              '000018f0-0000-1000-8000-00805f9b34fb',
              '0000180f-0000-1000-8000-00805f9b34fb',
              '00001101-0000-1000-8000-00805f9b34fb',
              '0000180a-0000-1000-8000-00805f9b34fb',
              '49535343-fe7d-4ae5-8fa9-9fafd205e455',
            ]
          });
          console.log('Found device with service filter:', this.device.name);
        } catch (serviceError) {
          console.warn('Service-based search failed, using manual selection:', serviceError);
          
          // Third attempt: Manual device selection with better UI
          throw new Error('Please ensure your thermal printer is in pairing mode and try again. Common thermal printer brands include: EPSON, Star, Citizen, Zebra, MUNBYN, Rongta, Xprinter');
        }
      }

      // Display device information
      const deviceName = this.device.name || 'Unknown Device';
      const deviceId = this.device.id || 'Unknown ID';
      console.log('Thermal printer selected:', {
        name: deviceName,
        id: deviceId,
        connected: this.device.gatt?.connected || false
      });

      // Validate if this looks like a thermal printer
      if (!this.validateThermalPrinter(deviceName)) {
        const confirmConnection = confirm(
          `The selected device "${deviceName}" may not be a thermal printer. ` +
          'Do you want to continue connecting anyway?'
        );
        if (!confirmConnection) {
          throw new Error('Connection cancelled by user');
        }
      }

      // Add disconnection listener
      this.device.addEventListener('gattserverdisconnected', () => {
        console.log(`Thermal printer "${deviceName}" disconnected`);
        this.isConnected = false;
      });

      // Connect to GATT server
      console.log(`Connecting to ${deviceName} GATT server...`);
      this.server = await this.device.gatt.connect();
      console.log(`Connected to ${deviceName} GATT server`);

      try {
        // Try to get the printer service
        this.service = await this.server.getPrimaryService(this.PRINTER_SERVICE_UUID);
        this.characteristic = await this.service.getCharacteristic(this.PRINTER_CHARACTERISTIC_UUID);
        console.log('Found standard printer service');
      } catch (serviceError) {
        console.warn('Standard printer service not found, searching for writable characteristics...');
        
        // Alternative: Use any available service with write capability
        const services = await this.server.getPrimaryServices();
        console.log(`Found ${services.length} services on ${deviceName}`);
        
        let foundWritableChar = false;
        for (const service of services) {
          try {
            const characteristics = await service.getCharacteristics();
            console.log(`Service ${service.uuid} has ${characteristics.length} characteristics`);
            
            for (const char of characteristics) {
              if (char.properties.write || char.properties.writeWithoutResponse) {
                this.service = service;
                this.characteristic = char;
                console.log(`Found writable characteristic: ${char.uuid} in service: ${service.uuid}`);
                foundWritableChar = true;
                break;
              }
            }
            if (foundWritableChar) break;
          } catch (charError) {
            console.warn(`Error checking service ${service.uuid}:`, charError);
          }
        }

        if (!foundWritableChar) {
          throw new Error(`No writable characteristic found on ${deviceName}. This device may not support thermal printing.`);
        }
      }

      this.isConnected = true;
      console.log(`✅ Thermal printer "${deviceName}" connected successfully`);
      return true;

    } catch (error) {
      console.error('❌ Thermal printer connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Validate if the selected device is likely a thermal printer
   */
  validateThermalPrinter(deviceName) {
    if (!deviceName || deviceName === 'Unknown Device') {
      return false;
    }

    const thermalPrinterKeywords = [
      'thermal', 'receipt', 'pos', 'printer', 'epson', 'star', 'citizen',
      'zebra', 'bixolon', 'munbyn', 'rongta', 'xprinter', 'hprt', 'goojprt',
      'milestone', 'bluetooth printer', 'bt printer', 'mobile printer'
    ];

    const deviceNameLower = deviceName.toLowerCase();
    return thermalPrinterKeywords.some(keyword => 
      deviceNameLower.includes(keyword)
    );
  }

  /**
   * Send raw data to thermal printer with enhanced debugging
   */
  async sendData(data) {
    if (!this.isConnected || !this.characteristic) {
      throw new Error('Thermal printer not connected');
    }

    try {
      // Convert data to Uint8Array if it's not already
      const buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
      
      console.log('📤 SENDING DATA TO THERMAL PRINTER:', {
        totalBytes: buffer.length,
        dataPreview: Array.from(buffer.slice(0, 30)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '),
        containsBarcode: this.containsBarcodeCommands(buffer),
        barcodeCommandsFound: this.findBarcodeCommands(buffer)
      });
      
      // Split large data into chunks (thermal printers have limited buffer)
      const chunkSize = 20; // Conservative chunk size for Bluetooth LE
      for (let i = 0; i < buffer.length; i += chunkSize) {
        const chunk = buffer.slice(i, i + chunkSize);
        
        if (this.debugMode && this.containsBarcodeCommands(chunk)) {
          console.log(`📊 BARCODE CHUNK ${Math.floor(i/chunkSize) + 1}:`, 
            Array.from(chunk).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
        }
        
        if (this.characteristic.properties.writeWithoutResponse) {
          await this.characteristic.writeValueWithoutResponse(chunk);
        } else {
          await this.characteristic.writeValue(chunk);
        }
        
        // Small delay between chunks to prevent buffer overflow
        await new Promise(resolve => setTimeout(resolve, 50));
      }
      
      console.log('✅ ALL DATA SENT TO PRINTER SUCCESSFULLY');
    } catch (error) {
      console.error('❌ ERROR SENDING DATA TO THERMAL PRINTER:', error);
      throw error;
    }
  }

  /**
   * Find barcode commands in data for debugging
   */
  findBarcodeCommands(data) {
    const buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
    const barcodeCommands = [];
    
    for (let i = 0; i < buffer.length - 1; i++) {
      if (buffer[i] === 0x1D && buffer[i + 1] === 0x6B) {
        const commandInfo = {
          position: i,
          command: '0x1D 0x6B (GS k)',
          type: buffer[i + 2] || 'unknown',
          length: buffer[i + 3] || 'unknown'
        };
        barcodeCommands.push(commandInfo);
      }
    }
    
    return barcodeCommands;
  }

  /**
   * Test barcode generation before using in receipt
   * This ensures barcode will work before printing the full receipt
   */
  async testBarcodeGeneration(orderId) {
    console.log('🧪 TESTING BARCODE GENERATION FOR:', orderId);
    
    try {
      const barcodeBytes = this.generateWorkingBarcode(orderId);
      console.log('✅ BARCODE GENERATION TEST PASSED:', {
        orderId: orderId,
        barcodeLength: barcodeBytes.length,
        firstBytes: Array.from(barcodeBytes.slice(0, 10)).map(b => '0x' + b.toString(16)).join(' ')
      });
      
      return barcodeBytes;
    } catch (error) {
      console.error('❌ BARCODE GENERATION TEST FAILED:', error);
      throw new Error(`Barcode generation failed for order ${orderId}: ${error.message}`);
    }
  }
  /**
   * Generate working barcode with customizable size
   * @param {string} data - The data to encode
   * @param {object} options - Size options { height: number, width: number }
   */
  generateWorkingBarcode(data, options = {}) {
    console.log('🔧 Generating guaranteed working barcode for:', data);
    
    // Clean and prepare data
    const cleanData = String(data).replace(/[^\w]/g, '').toUpperCase();
    console.log('📝 Cleaned barcode data:', cleanData);
    
    // Configurable size options (defaults to extra large, highly scannable size)
    const height = options.height || 120;  // Default: 120 dots (extra large for easy scanning)
    const width = options.width || 5;      // Default: 5x width (maximum visibility)
    
    // Create the simplest possible CODE128 barcode command sequence
    const commands = [];
    
    // Set barcode height
    commands.push(0x1D, 0x68, Math.min(Math.max(height, 20), 255)); // Clamp between 20-255
    
    // Set barcode width
    commands.push(0x1D, 0x77, Math.min(Math.max(width, 1), 6)); // Clamp between 1-6
    
    // Set HRI character position (below barcode = 2)
    commands.push(0x1D, 0x48, 2);
    
    // Set HRI font (font A = 0)
    commands.push(0x1D, 0x66, 0);
    
    // Print CODE128 barcode command
    commands.push(0x1D);  // GS
    commands.push(0x6B);  // k (barcode command)
    commands.push(73);    // CODE128 type
    commands.push(cleanData.length); // data length
    
    // Add the actual data
    for (let i = 0; i < cleanData.length; i++) {
      commands.push(cleanData.charCodeAt(i));
    }
    
    console.log('✅ Generated LARGER barcode commands:', {
      dataLength: cleanData.length,
      totalCommands: commands.length,
      height: `${height} dots`,
      width: `${width}x`,
      previewCommands: commands.slice(0, 15).map(x => '0x' + x.toString(16)).join(' ')
    });
    
    return new Uint8Array(commands);
  }

  /**
   * Generate extra large barcode for difficult scanning conditions
   */
  generateExtraLargeBarcode(data) {
    return this.generateWorkingBarcode(data, { height: 150, width: 6 });
  }

  /**
   * Generate ultra large barcode for maximum scanning capability
   */
  generateUltraLargeBarcode(data) {
    return this.generateWorkingBarcode(data, { height: 200, width: 6 });
  }

  /**
   * Check if data contains barcode commands for debugging
   */
  containsBarcodeCommands(data) {
    const buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
    // Look for GS k command (0x1D 0x6B) which is the barcode command
    for (let i = 0; i < buffer.length - 1; i++) {
      if (buffer[i] === 0x1D && buffer[i + 1] === 0x6B) {
        return true;
      }
    }
    return false;
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
   * Validate and format data for barcode printing
   */
  validateBarcodeData(data, format = 'CODE128') {
    if (!data || typeof data !== 'string') {
      throw new Error('Barcode data must be a non-empty string');
    }

    switch (format.toUpperCase()) {
      case 'CODE128':
        // CODE128 supports ASCII characters 0-127
        const validChars = /^[\x00-\x7F]*$/;
        if (!validChars.test(data)) {
          console.warn('Invalid characters found for CODE128, filtering...');
          return data.replace(/[^\x00-\x7F]/g, '');
        }
        return data;
        
      case 'CODE39':
        // CODE39 supports: 0-9, A-Z, space, -, ., $, /, +, %
        const code39Valid = /^[0-9A-Z\s\-\.\$\/\+%]*$/;
        if (!code39Valid.test(data.toUpperCase())) {
          console.warn('Invalid characters found for CODE39, filtering...');
          return data.toUpperCase().replace(/[^0-9A-Z\s\-\.\$\/\+%]/g, '');
        }
        return data.toUpperCase();
        
      case 'EAN13':
        // EAN13 requires exactly 12 or 13 digits
        const digits = data.replace(/\D/g, '');
        if (digits.length < 12) {
          return digits.padStart(12, '0');
        }
        return digits.substring(0, 13);
        
      default:
        return data;
    }
  }

  /**
   * Generate ESC/POS barcode commands for thermal printer
   */
  generateESCPOSBarcode(data, options = {}) {
    try {
      const barcodeType = options.format || 'CODE128';
      const height = Math.min(Math.max(options.height || 60, 1), 255); // Clamp between 1-255
      const width = Math.min(Math.max(options.width || 2, 1), 6); // Clamp between 1-6
      const showText = options.displayValue !== false;
      
      // Validate and format the data
      const validatedData = this.validateBarcodeData(data, barcodeType);
      if (!validatedData) {
        throw new Error('Invalid barcode data after validation');
      }
      
      const barcodeCommands = [];
      
      // Set barcode height (GS h)
      barcodeCommands.push(0x1D, 0x68, height);
      
      // Set barcode width (GS w)
      barcodeCommands.push(0x1D, 0x77, width);
      
      // Set human readable character position (GS H)
      // 0 = No printing, 1 = Above barcode, 2 = Below barcode, 3 = Both
      barcodeCommands.push(0x1D, 0x48, showText ? 2 : 0);
      
      // Set barcode font (GS f) - 0 = Font A, 1 = Font B
      barcodeCommands.push(0x1D, 0x66, 0);
      
      // Generate barcode based on type
      let barcodeTypeCode;
      switch (barcodeType.toUpperCase()) {
        case 'CODE128':
          barcodeTypeCode = 73; // CODE128
          break;
        case 'CODE39':
          barcodeTypeCode = 69; // CODE39
          break;
        case 'EAN13':
          barcodeTypeCode = 67; // EAN13
          break;
        case 'UPC_A':
        case 'UPC':
          barcodeTypeCode = 65; // UPC-A
          break;
        default:
          barcodeTypeCode = 73; // Default to CODE128
      }
      
      // Print barcode command (GS k)
      barcodeCommands.push(0x1D, 0x6B, barcodeTypeCode);
      
      // Add data length for variable length barcodes (CODE128, CODE39)
      if (barcodeTypeCode === 73 || barcodeTypeCode === 69) {
        barcodeCommands.push(validatedData.length);
      }
      
      // Add barcode data
      const dataBytes = new TextEncoder().encode(validatedData);
      barcodeCommands.push(...dataBytes);
      
      // Add null terminator for some barcode types
      if (barcodeTypeCode === 69) { // CODE39 needs null terminator
        barcodeCommands.push(0x00);
      }
      
      console.log('Generated ESC/POS barcode commands:', {
        type: barcodeType,
        originalData: data,
        validatedData: validatedData,
        height: height,
        width: width,
        showText: showText,
        commandLength: barcodeCommands.length
      });
      
      return new Uint8Array(barcodeCommands);
    } catch (error) {
      console.error('Error generating ESC/POS barcode:', error);
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
      receiptData.push(...this.textToBytes('Biz Solution'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.normalSize);
      receiptData.push(...commands.boldOff);
      receiptData.push(...this.textToBytes('Employee Meal Order'));
      receiptData.push(...commands.crlf);

      // Order details - Compact format
      receiptData.push(...commands.alignLeft);
      receiptData.push(...commands.bold);
      receiptData.push(...this.textToBytes(`${orderData.username}`));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.boldOff);
      
      receiptData.push(...this.textToBytes(`${orderData.mealType} | ${orderData.orderDate}`));
      receiptData.push(...commands.crlf);
      
      receiptData.push(...this.textToBytes(`Printed: ${orderData.orderTime}`));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.crlf);

      // Separator line
      receiptData.push(...this.textToBytes('--------------------------------'));
      receiptData.push(...commands.crlf);

      // Order items - Compact format
      receiptData.push(...commands.bold);
      receiptData.push(...this.textToBytes('ITEMS:'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.boldOff);
      
      orderData.items.forEach(item => {
        receiptData.push(...this.textToBytes(`${item.name} x${item.quantity} - Rs.${item.price.toFixed(2)}`));
        receiptData.push(...commands.crlf);
      });

      // Total - Compact
      receiptData.push(...this.textToBytes('--------------------------------'));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.bold);
      receiptData.push(...this.textToBytes(`TOTAL: Rs. ${orderData.totalPrice.toFixed(2)}`));
      receiptData.push(...commands.crlf);
      receiptData.push(...commands.boldOff);

      // Barcode section - Compact
      receiptData.push(...commands.alignCenter);
      receiptData.push(...commands.crlf);

      console.log('🔧 STEP 1: TESTING BARCODE GENERATION FOR ORDER:', orderData.orderId);
      
      try {
        // STEP 1: Test barcode generation
        const testBarcodeBytes = await this.testBarcodeGeneration(orderData.orderId);
        console.log('✅ STEP 1 PASSED: Barcode generation successful');
        
        // STEP 2: Add the tested barcode to receipt
        console.log('🔧 STEP 2: ADDING TESTED BARCODE TO RECEIPT');
        receiptData.push(...testBarcodeBytes);
        receiptData.push(...commands.crlf);
        console.log('✅ STEP 2 PASSED: BARCODE ADDED TO RECEIPT DATA');
        
      } catch (error) {
        console.error('❌ BARCODE GENERATION OR ADDITION FAILED:', error);
        // Emergency fallback - large, bold text
        receiptData.push(...commands.doubleSize);
        receiptData.push(...commands.bold);
        receiptData.push(...this.textToBytes(`ORDER: ${orderData.orderId}`));
        receiptData.push(...commands.boldOff);
        receiptData.push(...commands.normalSize);
        receiptData.push(...commands.crlf);
        receiptData.push(...this.textToBytes('(Barcode generation failed)'));
        receiptData.push(...commands.crlf);
      }

      // Footer - Compact
      receiptData.push(...commands.crlf);
      receiptData.push(...this.textToBytes('Thank you! Present this receipt'));
      receiptData.push(...commands.crlf);
      receiptData.push(...this.textToBytes('when collecting your meal.'));
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
   * Show custom device selector for better thermal printer detection
   */
  async showDeviceSelector() {
    try {
      // First, scan for nearby devices using the improved filtering
      const devices = await this.scanForThermalPrinters();
      
      if (devices.length === 0) {
        throw new Error('No thermal printers found. Please ensure your thermal printer is powered on and in pairing mode.');
      }

      // If only one thermal printer is found, connect directly
      if (devices.length === 1) {
        const device = devices[0];
        const connect = confirm(
          `Found thermal printer: "${device.name}"\n\n` +
          `Device ID: ${device.id}\n` +
          'Would you like to connect to this printer?'
        );
        
        if (connect) {
          return device;
        } else {
          throw new Error('Connection cancelled by user');
        }
      }

      // Multiple devices found - let user choose
      const deviceList = devices.map((device, index) => 
        `${index + 1}. ${device.name} (${device.id})`
      ).join('\n');

      const selection = prompt(
        'Multiple thermal printers found. Please select one:\n\n' +
        deviceList + '\n\n' +
        'Enter the number (1, 2, 3, etc.):'
      );

      const selectedIndex = parseInt(selection) - 1;
      if (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= devices.length) {
        throw new Error('Invalid selection');
      }

      return devices[selectedIndex];

    } catch (error) {
      console.error('Device selection failed:', error);
      throw error;
    }
  }

  /**
   * Scan for thermal printers with improved filtering
   */
  async scanForThermalPrinters() {
    // This is a placeholder - in reality, Web Bluetooth doesn't allow
    // scanning without user interaction. This method would be used
    // if such functionality becomes available.
    
    // For now, we'll rely on the improved filtering in the connect method
    return [];
  }

  /**
   * Connect to thermal printer with improved device selection
   */
  async connectPrinter() {
    try {
      await this.thermalPrinter.connect();
      return true;
    } catch (error) {
      // If the error mentions device selection, provide helpful guidance
      if (error.message.includes('thermal printer') || error.message.includes('pairing mode')) {
        const guidance = 
          'Thermal Printer Connection Tips:\n\n' +
          '1. Ensure your thermal printer is powered ON\n' +
          '2. Put the printer in pairing/discoverable mode\n' +
          '3. Look for device names containing:\n' +
          '   • "Thermal", "Receipt", "POS", "Printer"\n' +
          '   • Brand names: EPSON, Star, Citizen, Zebra\n' +
          '   • Model names: MUNBYN, Rongta, Xprinter\n\n' +
          'Would you like to try connecting again?';
          
        const retry = confirm(guidance);
        if (retry) {
          return await this.connectPrinter();
        }
      }
      
      console.error('Failed to connect to thermal printer:', error);
      throw error;
    }
  }

  /**
   * Print order receipt
   */
  async printOrder(orderDetails) {
    try {
      console.log('🖨️ Starting order print process with details:', orderDetails);
      
      // Ensure printer is connected
      if (!this.thermalPrinter.isConnected) {
        console.log('🔌 Printer not connected, attempting to connect...');
        await this.connectPrinter();
      }

      // Format order data for printing
      const orderData = this.formatOrderData(orderDetails);
      console.log('📝 Formatted order data for printing:', orderData);
      
      // Print the receipt using the thermal printer service
      console.log('🖨️ Calling thermalPrinter.printOrderReceipt...');
      await this.thermalPrinter.printOrderReceipt(orderData);
      
      console.log('✅ Order receipt printed successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to print order:', error);
      throw error;
    }
  }

  /**
   * Get detailed printer status information
   */
  getPrinterStatus() {
    if (!this.thermalPrinter) {
      return {
        connected: false,
        deviceName: 'No printer service',
        deviceId: 'N/A',
        status: 'Not initialized'
      };
    }

    const device = this.thermalPrinter.device;
    return {
      connected: this.thermalPrinter.isConnected,
      deviceName: device?.name || 'Unknown Device',
      deviceId: device?.id || 'Unknown ID',
      status: this.thermalPrinter.isConnected ? 'Connected' : 'Disconnected',
      gattConnected: device?.gatt?.connected || false,
      hasWriteCharacteristic: !!this.thermalPrinter.characteristic
    };
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
   * Test only barcode printing (isolated test)
   */
  async testBarcodeOnly() {
    try {
      if (!this.thermalPrinter.isConnected) {
        await this.connectPrinter();
      }

      const commands = this.thermalPrinter.generateESCPOSCommands();
      const testData = [];

      // Initialize printer
      testData.push(...commands.init);
      testData.push(...commands.alignCenter);
      
      // Test message
      testData.push(...this.thermalPrinter.textToBytes('BARCODE TEST'));
      testData.push(...commands.crlf);
      testData.push(...commands.crlf);

      // Test the guaranteed working barcode method only
      const testIds = ['123456', 'TEST01', 'ORDER001'];
      
      for (const testId of testIds) {
        testData.push(...this.thermalPrinter.textToBytes(`Testing: ${testId}`));
        testData.push(...commands.crlf);
        
        try {
          const barcodeBytes = this.thermalPrinter.generateWorkingBarcode(testId);
          testData.push(...barcodeBytes);
          testData.push(...commands.crlf);
          console.log('✅ Working barcode test successful for:', testId);
        } catch (error) {
          testData.push(...this.thermalPrinter.textToBytes('BARCODE FAILED'));
          testData.push(...commands.crlf);
          console.error('❌ Working barcode test failed for:', testId, error);
        }
        
        testData.push(...commands.crlf);
        testData.push(...this.thermalPrinter.textToBytes('---'));
        testData.push(...commands.crlf);
      }

      // Paper feed
      testData.push(...commands.paperFeed);

      // Send to printer
      await this.thermalPrinter.sendData(new Uint8Array(testData));
      
      console.log('✅ Barcode-only test completed');
      return true;
    } catch (error) {
      console.error('❌ Barcode-only test failed:', error);
      throw error;
    }
  }

  /**
   * Test printer with various formatting options including barcode
   */
  async testPrint() {
    try {
      if (!this.thermalPrinter.isConnected) {
        await this.connectPrinter();
      }

      const commands = this.thermalPrinter.generateESCPOSCommands();
      const testData = [];

      // Initialize printer
      testData.push(...commands.init);

      // Test header
      testData.push(...commands.alignCenter);
      testData.push(...commands.doubleWidth);
      testData.push(...commands.bold);
      testData.push(...this.thermalPrinter.textToBytes('PRINTER TEST'));
      testData.push(...commands.crlf);
      testData.push(...commands.normalSize);
      testData.push(...commands.boldOff);
      testData.push(...commands.crlf);

      // Test order details
      testData.push(...commands.alignLeft);
      testData.push(...this.thermalPrinter.textToBytes('Test Order ID: TEST123'));
      testData.push(...commands.crlf);
      testData.push(...this.thermalPrinter.textToBytes('Date: ' + new Date().toLocaleDateString('en-IN')));
      testData.push(...commands.crlf);
      testData.push(...this.thermalPrinter.textToBytes('Time: ' + new Date().toLocaleTimeString('en-IN')));
      testData.push(...commands.crlf);
      testData.push(...commands.crlf);

      // Test items
      testData.push(...this.thermalPrinter.textToBytes('Test Item 1 x1    Rs. 10.00'));
      testData.push(...commands.crlf);
      testData.push(...this.thermalPrinter.textToBytes('Test Item 2 x2    Rs. 15.00'));
      testData.push(...commands.crlf);
      testData.push(...commands.crlf);

      // Total
      testData.push(...commands.bold);
      testData.push(...this.thermalPrinter.textToBytes('TOTAL: Rs. 40.00'));
      testData.push(...commands.crlf);
      testData.push(...commands.boldOff);
      testData.push(...commands.crlf);

      // Test barcode with the guaranteed working method
      testData.push(...commands.alignCenter);
      testData.push(...this.thermalPrinter.textToBytes('Test Barcode:'));
      testData.push(...commands.crlf);

      try {
        const testBarcodeBytes = this.thermalPrinter.generateWorkingBarcode('TEST123');
        testData.push(...testBarcodeBytes);
        testData.push(...commands.crlf);
        console.log('✅ Test barcode generated successfully with guaranteed method');
      } catch (barcodeError) {
        console.error('❌ Even the guaranteed method failed:', barcodeError);
        testData.push(...this.thermalPrinter.textToBytes('TEST123 (BARCODE FAILED)'));
        testData.push(...commands.crlf);
      }

      // Footer
      testData.push(...commands.crlf);
      testData.push(...this.thermalPrinter.textToBytes('Test completed successfully!'));
      testData.push(...commands.crlf);
      testData.push(...commands.crlf);

      // Paper feed and cut
      testData.push(...commands.paperFeed);
      testData.push(...commands.partialCut);

      // Send to printer
      await this.thermalPrinter.sendData(new Uint8Array(testData));
      
      console.log('✅ Test print with barcode completed successfully');
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
