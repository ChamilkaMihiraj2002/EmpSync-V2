# Thermal Printer Integration for Order Receipts

This implementation adds 80mm thermal printer support via Bluetooth to the EmpSync-V2 meal ordering system.

## Features

- **Barcode Generation**: Automatically generates barcodes for order IDs using JsBarcode
- **Receipt Printing**: Prints detailed order receipts including:
  - Company name (BizSolution)
  - Order ID with barcode
  - Employee name
  - Order date and time
  - Meal type
  - Ordered items with quantities and prices
  - Total amount
- **Bluetooth Connectivity**: Uses Web Bluetooth API for wireless thermal printer connection
- **ESC/POS Commands**: Implements standard thermal printer commands for formatting

## How to Use

### 1. Identify Your Thermal Printer

**Option A: Use the Device Scanner Tool**
1. Open `thermal-printer-scanner.html` in your browser
2. Click "Scan for Bluetooth Devices"
3. Look for devices marked as "Likely Thermal Printer"
4. Note the device name for use in the main application

**Option B: Manual Identification**
Look for device names containing these keywords:
- "Thermal", "Receipt", "POS", "Printer"
- Brand names: EPSON, Star, Citizen, Zebra
- Popular models: MUNBYN, Rongta, Xprinter, HPRT

### 2. Connect Thermal Printer

1. Make sure your 80mm thermal printer is powered on and in pairing mode
2. On the Order page (Page3), click the **"Connect Printer"** button in the top right
3. When prompted, select your thermal printer from the Bluetooth device list
   - The system will now show only thermal printer devices or provide better filtering
   - Look for your printer name from Step 1
4. Once connected, the button will show **"✓ [Printer Name]"**

### 3. Test Printing

1. After connecting the printer, a **"Test Print"** button will appear
2. Click it to print a test receipt and verify the printer is working correctly

### 3. Order Placement with Automatic Printing

1. Select meals and place your order as usual
2. After successful order placement, a receipt will automatically print with:
   - Order barcode
   - Order details
   - Employee information
   - Meal items and total

## Technical Implementation

### Files Modified/Created

- **`/client/src/utils/orderprint.js`**: Main thermal printer service
- **`/client/src/utils/thermalPrinterConfig.js`**: Configuration utilities
- **`/client/src/components/organisms/OrderTabUI/Page3/Page3.jsx`**: Integrated printer functionality
- **`/thermal-printer-scanner.html`**: Device identification tool

### Device Scanner Tool (`thermal-printer-scanner.html`)

A standalone HTML tool to help identify thermal printers:
- Scans for Bluetooth devices with improved filtering
- Identifies likely thermal printers automatically
- Provides device name and ID for easy identification
- Works independently of the main application

### Key Components

#### ThermalPrinterService Class
- Handles Bluetooth connection to thermal printers
- Generates ESC/POS commands for formatting
- Converts barcodes to thermal printer bitmap format

#### OrderReceiptPrinter Class
- High-level interface for printing order receipts
- Formats order data for printing
- Manages printer connection state

### Dependencies Added

- **`jsbarcode`**: For barcode generation (already installed)
- **`escpos-buffer`**: For ESC/POS thermal printer commands

## Supported Printer Features

- 80mm thermal paper width
- Text formatting (bold, alignment, size)
- Barcode printing (CODE128 format)
- Paper cutting (full/partial)
- Multiple text sizes and spacing

## Browser Compatibility

- **Chrome/Chromium**: Full Web Bluetooth support
- **Edge**: Full Web Bluetooth support
- **Firefox**: Limited support (may require flags)
- **Safari**: Not supported

## Troubleshooting

### Device Selection Issues

**Problem**: All Bluetooth devices are shown instead of just thermal printers
**Solutions**:
1. Use the `thermal-printer-scanner.html` tool first to identify your printer
2. Ensure your thermal printer is in pairing mode
3. Look for device names containing thermal printer keywords
4. If all devices still show, select the one that matches your printer brand/model

**Problem**: Device names show as "Unknown Device" or incomplete names
**Solutions**:
1. Restart your thermal printer and put it back in pairing mode
2. Try moving the printer closer to your computer
3. Clear your browser's Bluetooth cache (Settings > Privacy > Clear browsing data > Cached images and files)
4. Use the device scanner tool which may show more detailed information

**Problem**: Selected device is not actually a thermal printer
**Solutions**:
1. The system will warn you if the selected device doesn't look like a thermal printer
2. You can still proceed if you're certain it's the right device
3. Look for these common thermal printer brands:
   - EPSON TM series
   - Star TSP series  
   - Citizen CT series
   - Zebra ZD series
   - MUNBYN, Rongta, Xprinter models

### Printer Not Connecting
1. Ensure printer is in pairing mode
2. Check if Web Bluetooth is enabled in browser
3. Try refreshing the page and reconnecting
4. Verify printer is compatible with ESC/POS commands

### Print Quality Issues
1. Check thermal paper alignment
2. Ensure paper is not faded or low quality
3. Verify printer head is clean
4. Check printer battery/power levels

### Barcode Not Scanning
1. Ensure sufficient contrast
2. Check barcode size settings
3. Verify barcode format compatibility with scanners
4. Test with different barcode scanner apps

## Configuration

You can modify printing settings in `/client/src/utils/orderprint.js`:

```javascript
// Barcode options
const barcodeOptions = {
  format: 'CODE128',
  width: 2,
  height: 60,
  displayValue: true,
  fontSize: 10
};

// Print formatting
const commands = this.generateESCPOSCommands();
```

## Error Handling

The system includes comprehensive error handling:
- Connection failures show user-friendly notifications
- Print errors are logged and displayed
- Automatic retry logic for connection issues
- Graceful fallback if printer is unavailable

## Future Enhancements

- Support for different paper sizes (58mm)
- Custom receipt templates
- Print queue management
- Multiple printer support
- Network printer support (Wi-Fi)
