// Thermal Printer Configuration and Utilities
// Additional helper functions for thermal printing

/**
 * Advanced thermal printer configuration options
 */
export const ThermalPrinterConfig = {
  // Paper sizes
  PAPER_WIDTH_80MM: 576, // 80mm in dots (72 DPI)
  PAPER_WIDTH_58MM: 384, // 58mm in dots (72 DPI)
  
  // Print densities
  DENSITY_LIGHT: 1,
  DENSITY_MEDIUM: 2,
  DENSITY_DARK: 3,
  
  // Barcode formats supported
  BARCODE_FORMATS: {
    CODE128: 'CODE128',
    CODE39: 'CODE39',
    EAN13: 'EAN13',
    UPC_A: 'UPC',
    QR_CODE: 'QR'
  },
  
  // Common service UUIDs for different thermal printer brands
  PRINTER_SERVICES: {
    GENERIC: '000018f0-0000-1000-8000-00805f9b34fb',
    EPSON: '00001101-0000-1000-8000-00805f9b34fb',
    STAR: '00001105-0000-1000-8000-00805f9b34fb',
    CITIZEN: '49535343-fe7d-4ae5-8fa9-9fafd205e455'
  }
};

/**
 * Enhanced error handling for thermal printers
 */
export class ThermalPrinterError extends Error {
  constructor(message, code, originalError = null) {
    super(message);
    this.name = 'ThermalPrinterError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Printer status codes
 */
export const PrinterStatus = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  PRINTING: 'printing',
  ERROR: 'error',
  PAPER_EMPTY: 'paper_empty',
  COVER_OPEN: 'cover_open'
};

/**
 * Utility functions for thermal printing
 */
export const ThermalPrinterUtils = {
  
  /**
   * Convert text to different encodings for international support
   */
  encodeText(text, encoding = 'utf-8') {
    try {
      switch (encoding.toLowerCase()) {
        case 'iso-8859-1':
        case 'latin1':
          return new TextEncoder('iso-8859-1').encode(text);
        case 'utf-8':
        default:
          return new TextEncoder().encode(text);
      }
    } catch (error) {
      // Fallback to UTF-8
      return new TextEncoder().encode(text);
    }
  },

  /**
   * Format currency for receipt printing
   */
  formatCurrency(amount, currency = 'Rs.', decimals = 2) {
    return `${currency} ${Number(amount).toFixed(decimals)}`;
  },

  /**
   * Create a table-like layout for receipt items
   */
  formatReceiptLine(leftText, rightText, lineWidth = 32) {
    const leftLen = leftText.length;
    const rightLen = rightText.length;
    const totalLen = leftLen + rightLen;
    
    if (totalLen >= lineWidth) {
      return leftText.substring(0, lineWidth - rightLen - 3) + '...' + rightText;
    }
    
    const spaces = lineWidth - totalLen;
    return leftText + ' '.repeat(spaces) + rightText;
  },

  /**
   * Create separator lines
   */
  createSeparator(char = '-', width = 32) {
    return char.repeat(width);
  },

  /**
   * Center text within a given width
   */
  centerText(text, width = 32) {
    if (text.length >= width) return text.substring(0, width);
    const padding = Math.floor((width - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(width - text.length - padding);
  },

  /**
   * Generate QR code data for mobile scanning
   */
  generateQRData(orderData) {
    return JSON.stringify({
      orderId: orderData.orderId,
      employeeName: orderData.username,
      totalAmount: orderData.totalPrice,
      orderDate: orderData.orderDate,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Validate order data before printing
   */
  validateOrderData(orderData) {
    const required = ['orderId', 'username', 'orderDate', 'orderTime', 'items', 'totalPrice'];
    const missing = required.filter(field => !orderData[field]);
    
    if (missing.length > 0) {
      throw new ThermalPrinterError(
        `Missing required fields: ${missing.join(', ')}`,
        'INVALID_ORDER_DATA'
      );
    }

    if (!Array.isArray(orderData.items) || orderData.items.length === 0) {
      throw new ThermalPrinterError(
        'Order must contain at least one item',
        'EMPTY_ORDER'
      );
    }

    return true;
  },

  /**
   * Generate receipt number with date prefix
   */
  generateReceiptNumber(orderId) {
    const now = new Date();
    const datePrefix = now.toISOString().slice(0, 10).replace(/-/g, '');
    return `${datePrefix}-${orderId}`;
  },

  /**
   * Calculate optimal chunk size based on printer capabilities
   */
  getOptimalChunkSize(printerName = '') {
    const lowerName = printerName.toLowerCase();
    
    // Adjust chunk sizes based on known printer capabilities
    if (lowerName.includes('epson')) return 32;
    if (lowerName.includes('star')) return 24;
    if (lowerName.includes('citizen')) return 20;
    
    // Default conservative size for unknown printers
    return 16;
  }
};

/**
 * Print templates for different receipt types
 */
export const PrintTemplates = {
  
  /**
   * Standard meal order receipt template
   */
  mealOrder: {
    header: {
      companyName: 'BizSolution',
      subtitle: 'Employee Meal Order',
      showLogo: false
    },
    barcode: {
      enabled: true,
      format: 'CODE128',
      width: 2,
      height: 60,
      position: 'bottom'
    },
    footer: {
      thankYou: 'Thank you for your order!',
      instructions: 'Please present this receipt when collecting your meal.',
      showTimestamp: true
    }
  },

  /**
   * Simple receipt template (minimal)
   */
  simple: {
    header: {
      companyName: 'BizSolution',
      subtitle: null,
      showLogo: false
    },
    barcode: {
      enabled: true,
      format: 'CODE128',
      width: 1,
      height: 40,
      position: 'bottom'
    },
    footer: {
      thankYou: null,
      instructions: null,
      showTimestamp: false
    }
  }
};

/**
 * Debugging utilities for thermal printer development
 */
export const ThermalPrinterDebug = {
  
  /**
   * Log ESC/POS commands in human-readable format
   */
  logCommands(commandArray) {
    const commandMap = {
      '1B40': 'ESC @ (Initialize)',
      '1B45': 'ESC E (Bold)',
      '1B61': 'ESC a (Align)',
      '1B21': 'ESC ! (Font)',
      '1D56': 'GS V (Cut)',
      '0A': 'LF (Line Feed)',
      '0D0A': 'CR+LF (New Line)'
    };

    const hexString = Array.from(commandArray)
      .map(byte => byte.toString(16).padStart(2, '0').toUpperCase())
      .join('');

    console.log('ESC/POS Commands:', hexString);
    
    // Try to identify known command sequences
    for (const [pattern, description] of Object.entries(commandMap)) {
      if (hexString.includes(pattern)) {
        console.log(`  -> ${description}`);
      }
    }
  },

  /**
   * Test printer with various formatting options
   */
  async testAllFormats(printer) {
    const tests = [
      { name: 'Normal Text', command: () => printer.printText('Normal text test') },
      { name: 'Bold Text', command: () => printer.printText('Bold text test', { bold: true }) },
      { name: 'Center Align', command: () => printer.printText('Centered text', { align: 'center' }) },
      { name: 'Large Text', command: () => printer.printText('Large text', { size: 'large' }) },
      { name: 'Barcode', command: () => printer.printBarcode('123456789', 'CODE128') }
    ];

    for (const test of tests) {
      try {
        console.log(`Testing: ${test.name}`);
        await test.command();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Test failed: ${test.name}`, error);
      }
    }
  }
};

export default {
  ThermalPrinterConfig,
  ThermalPrinterError,
  PrinterStatus,
  ThermalPrinterUtils,
  PrintTemplates,
  ThermalPrinterDebug
};
