# Date Fix for Multi-Order Receipts

## Issue Fixed
When placing orders for both today and tomorrow (e.g., today's lunch + tomorrow's dinner), both receipts were printing with tomorrow's date instead of their respective dates.

## Root Cause
The `orderDate` calculation in the `placeOrder` function was using `selectedDate` (the currently active date tab) instead of using the specific `date` from each individual order group.

```javascript
// ❌ BEFORE - Wrong: Used currently selected date tab
const orderDate = selectedDate === "today" 
  ? currentTimeRef.current.toISOString()
  : new Date(currentTimeRef.current.getTime() + 24 * 60 * 60 * 1000).toISOString();

// ✅ AFTER - Correct: Uses the specific date for each order
const orderDate = date === "today"  // 'date' comes from each grouped order
  ? currentTimeRef.current.toISOString()
  : new Date(currentTimeRef.current.getTime() + 24 * 60 * 60 * 1000).toISOString();
```

## How It Works Now

### Order Grouping
Orders are grouped by `${item.date}-${item.mealTime}`, creating separate groups like:
- `"today-1"` (Today's Breakfast)
- `"today-2"` (Today's Lunch) 
- `"tomorrow-2"` (Tomorrow's Lunch)
- `"tomorrow-3"` (Tomorrow's Dinner)

### Date Calculation
Each order group now uses its own `date` value:
- **Today's orders**: `date = "today"` → Uses current date
- **Tomorrow's orders**: `date = "tomorrow"` → Uses current date + 24 hours

### Example Scenario
**User selects:**
- Today's lunch (2 meals)
- Tomorrow's dinner (1 meal)

**Result:**
1. **Today's lunch receipt**:
   - Date: Today's date (e.g., "19/8/2025")
   - Time: Current print time
   - Barcode: Unique order ID for lunch order
   
2. **Tomorrow's dinner receipt**:
   - Date: Tomorrow's date (e.g., "20/8/2025") 
   - Time: Current print time
   - Barcode: Unique order ID for dinner order

## Debug Logging Added
Added logging to track date calculations:
```javascript
console.log(`🗓️ Order date calculation for ${key}:`, {
  orderKey: key,
  orderDateType: date,
  calculatedOrderDate: orderDate,
  mealTime: mealTime,
  currentlySelectedDate: selectedDate
});
```

This helps verify that each order is getting the correct date calculation.

## Testing
To test this fix:
1. Select meals for today (any meal time)
2. Switch to tomorrow tab
3. Select meals for tomorrow (any meal time)
4. Click "Place Order"
5. Verify that each receipt prints with the correct date:
   - Today's receipt shows today's date
   - Tomorrow's receipt shows tomorrow's date

## Benefits
✅ **Accurate Dating**: Each receipt shows the correct order date  
✅ **Kitchen Operations**: Staff can clearly see which meals are for which day  
✅ **Audit Trail**: Proper date tracking for meal service management  
✅ **User Trust**: Receipts match the actual order dates selected  

This fix ensures that multi-day orders are properly tracked and printed with accurate dates for each respective meal service.
