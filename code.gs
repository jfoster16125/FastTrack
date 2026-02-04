function doPost(e) {
  if (e.parameter) return handleRequest(e.parameter);
  if (e.postData) return handleRequest(JSON.parse(e.postData.contents));
}

function doGet(e) {
  return handleRequest(e.parameter);
}

function handleRequest(params) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  var action = params.action;
  var userId = params.userId;
  var userPass = params.password;
  var now = new Date();

  // 1. HELPER: FIND LAST ROW FOR USER
  // Returns { index: number, status: string }
  function findUserRow() {
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var data = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
      for (var i = data.length - 1; i >= 0; i--) {
        if (data[i][0] == userId && data[i][1] == userPass) {
          return { index: i + 2, status: data[i][2] }; // Return 1-based index
        }
      }
    }
    return null;
  }

  var userRow = findUserRow();

  // --- LOG WEIGHT INDEPENDENTLY ---
  if (action === "logWeight") {
    if (userRow) {
      // Update the weight column (Column 7) of the most recent entry (active or completed)
      sheet.getRange(userRow.index, 7).setValue(params.weight);
      return output({status: "weight_logged"});
    } else {
      return output({error: "No history found to attach weight to."});
    }
  }

  // --- TOGGLE FAST (START/END) ---
  if (action === "toggleFast") {
    
    // STRICT MODE: END FAST
    if (params.mode === "END") {
      if (userRow && userRow.status === "ACTIVE") {
        var endTime = params.customEndTime ? new Date(parseInt(params.customEndTime)) : now;
        
        sheet.getRange(userRow.index, 3).setValue("COMPLETED"); 
        sheet.getRange(userRow.index, 5).setValue(endTime);         
        if (params.weight) sheet.getRange(userRow.index, 7).setValue(params.weight);
        
        return output({status: "ended"});
      } else {
        return output({error: "No active fast found to end"});
      }
    } 
    
    // STRICT MODE: START FAST
    else if (params.mode === "START") {
      // Safety: Close old fast if it exists and is somehow stuck
      if (userRow && userRow.status === "ACTIVE") {
        sheet.getRange(userRow.index, 3).setValue("COMPLETED");
        sheet.getRange(userRow.index, 5).setValue(now);
      }

      var startTime = params.customStartTime ? new Date(parseInt(params.customStartTime)) : now;
      sheet.appendRow([userId, userPass, "ACTIVE", startTime, "", params.goalHours || 16, ""]);
      return output({status: "started", startTime: startTime.getTime()});
    }
    
    // START ADJUSTMENT (Modify active fast start time)
    else if (params.mode === "ADJUST_START") {
       if (userRow && userRow.status === "ACTIVE" && params.customStartTime) {
         var newStart = new Date(parseInt(params.customStartTime));
         sheet.getRange(userRow.index, 4).setValue(newStart);
         return output({status: "started", startTime: newStart.getTime()});
       }
    }
  }

  // --- GET DATA ---
  if (action === "getInitialData") {
    var data = sheet.getDataRange().getValues();
    var history = [];
    var currentFast = null;

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] == userId && data[i][1] == userPass) {
        var sTime = new Date(data[i][3]).getTime();
        var eTime = data[i][4] ? new Date(data[i][4]).getTime() : null;
        var row = { startTime: sTime, endTime: eTime, status: data[i][2], goal: data[i][5], weight: data[i][6] };
        
        if (row.status === "ACTIVE") currentFast = row;
        else history.push(row);
      }
    }
    return output({ currentFast: currentFast, history: history });
  }
}

function output(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
