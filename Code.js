



/*  */
function doGet() {

    /* 先将 HTML 读取为模板 */
    const template = HtmlService.createTemplateFromFile("index"); 

    /* 执行 evaluate 触发服务器端的解析和翻译 */
    const htmlOutput = template.evaluate();

    return htmlOutput

        /* 允许网页在 Google Sheets 的 Web App 框架中加载 */
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)

        /* 加上 viewport 确保在手机端完美自适应 */
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
}





/*  
    在 index.html 里使用
    用于加载 css.html 和 script.html
*/
function include(file) {
    return HtmlService.createHtmlOutputFromFile(file).getContent();
}





/*====================================================================
    Google Sheets 相关
====================================================================*/

const TETRIS_SHEET = "Tetris"





/*------------------------------------------------------------------*/





function getSheet(sheetName) {
    let sheet = null

    if (sheetName) {
        sheet = SpreadsheetApp
            .getActiveSpreadsheet()
            .getSheetByName(sheetName);
    }

    return sheet;
}





/*------------------------------------------------------------------*/





/* 拿到 Google Sheets 里的指定 sheet 的全部 data */
function getAllSheetData(sheetName) {
    let data = null;

    if (sheetName) {
        const sheet = getSheet(sheetName);

        /* 
            getDataRange() 自动把全部 data 取出 
            (只会拿到最后一个有效 data, 不会再往后拿去其他空格), 
            不管 data 之间的空格有多少
        */
        if (sheet) {
            data = sheet
                .getDataRange()
                .getValues();
        }
    }

    return data;
}





/*------------------------------------------------------------------*/





/* 拿到所有 header 而已 */
function getListOfHeader(sheetName) {
    let headerList = null;

    if (sheetName) {

        /* 获取所有 data */
        headerList = getAllSheetData(sheetName);

        if (headerList) {

            /* 只拿取第一个元素 (shift()), 而第一 row 通常就是 header */
            headerList = headerList
                .shift()
                .map(function (header) {
                    return String(header).trim();
                });
        }
    }

    return headerList;
}





/*------------------------------------------------------------------*/





function getIndexOfHeader(sheetName, headerName) {
    let index = -1;

    if (sheetName && headerName) {
        const headerList = getListOfHeader(sheetName);

        if (headerList) {
            index = headerList.indexOf(headerName);
        }
    }

    return index;
}





/*------------------------------------------------------------------*/





function getDataOfColumn(sheetName, headerName, toLowerCase) {
    toLowerCase = (toLowerCase === true || toLowerCase === "true");

    let columnData = null;

    if (sheetName && headerName) {
        const allData = getAllSheetData(sheetName); 

        if (allData) {
            const targetIndex = getIndexOfHeader(sheetName, headerName);

            if (targetIndex !== -1) {
                columnData = [];

                for (let i = 0; i < allData.length; i++) {
                    let data = allData[i][targetIndex].trim();
                    data = toLowerCase ? data.toLowerCase() : data;
                    columnData.push(data);
                }

                /* 把第一个元素拿掉因为是 header */
                columnData.splice(0, 1);
            }
        }
    }
    
    return columnData;
}





/*------------------------------------------------------------------*/





/*
    拿到指定单元格 
    (可以用其他 method 对这个单元格
    如 .getValue(), .setValue()) 
*/
function getCell(sheetName, rowIndex, columnIndex) {
    let cell = null;

    if (
        sheetName && 
        !isNaN(rowIndex) && 
        !isNaN(columnIndex) && 
        rowIndex >= 0 && 
        columnIndex >= 0
    ) {

        /*  
            + 1 因为 Google Sheets 的 index 是从 1 开始
            + 2 以避免拿到 header
        */
        rowIndex += 2;
        columnIndex += 1;

        const sheet = getSheet(sheetName);

        if (sheet) {
            cell = sheet.getRange(rowIndex, columnIndex);
        }
    }
    
    return cell;
}





/*------------------------------------------------------------------*/





function getDataOfCell(sheetName, headerName, targetRowIndex) {
    let cellData = null;

    if (
        sheetName && 
        headerName && 
        isNaN(targetRowIndex) && 
        targetRowIndex >= 0
    ) {
        
    }

    return cellData;
}