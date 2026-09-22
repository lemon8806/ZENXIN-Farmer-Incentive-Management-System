



/* 网页一开始加载后自动执行 */
/* Automatically runs when the webpage initially loads */
function doGet() {

    /* 先将 index.html 读取为模板 */
    /* First, read index.html as a template */
    const template = HtmlService.createTemplateFromFile("index"); 

    /* 用 evaluate() 解析和翻译 index.html 里的代码 */
    /* Use evaluate() to parse and render the code in index.html */
    const htmlOutput = template.evaluate();

    return htmlOutput

        /* 允许网页在 Google Sheets 的 Web App 框架中加载 */
        /* Allow the webpage to load in the Google Sheets Web App framework */
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)

        /* 加上 viewport 确保在手机端完美自适应 */
        /* Add a viewport so the page adapts properly on mobile devices */
        .addMetaTag("viewport", "width=device-width, initial-scale=1");
}





/*  
    在 index.html 里使用
    用于加载 css.html 和 script.html
*/
/*
    Used in index.html
    Loads css.html and script.html
*/
function include(file) {
    return HtmlService.createHtmlOutputFromFile(file).getContent();
}





/*====================================================================
    Google Sheets 相关
====================================================================*/
/*====================================================================
    Google Sheets related functions
====================================================================*/

const TETRIS_SHEET = "Tetris"





/*------------------------------------------------------------------*/





/*  
    获取 Google Sheets 本身, 
    可以对其进行其他动作 
    (如: getDataRange())
*/
/*
    Get the Google Sheets spreadsheet itself,
    so other actions can be performed on it
    (such as: getDataRange())
*/
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
/* Get all data from the specified sheet in Google Sheets */
function getAllSheetData(sheetName) {
    let data = null;

    if (sheetName) {
        const sheet = getSheet(sheetName);

        /* 
            getDataRange() 自动把全部 data 取出 
            (只会拿到最后一个有效 data, 不会再往后拿去其他空格), 
            不管 data 之间的空格有多少
        */
        /*
            getDataRange() automatically retrieves all data
            (it only goes as far as the last cell containing data),
            regardless of how many blank cells are between the data
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
/* Get only all headers */
function getListOfHeader(sheetName) {
    let headerList = null;

    if (sheetName) {

        /* 获取所有 data */
        /* Get all data */
        headerList = getAllSheetData(sheetName);

        if (headerList) {

            /* 只拿取第一个元素 (shift()), 而第一 row 通常就是 header */
            /* Take only the first element (shift()), since the first row is usually the header */
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





/* 拿到指定 header 在指定 sheet 的 index */
/* Get the index of the specified header in the specified sheet */
function getIndexOfHeader(sheetName, headerName) {

    /* index = -1 代表该 header 不存在与指定 sheet 里 */
    /* index = -1 means that the header does not exist in the specified sheet */
    let index = -1;

    if (sheetName && headerName) {

        /* 拿到指定 sheet 里的全部 header */
        /* Get all headers from the specified sheet */
        const headerList = getListOfHeader(sheetName);

        if (headerList) {

            /* 拿到指定 header 的 index */
            /* Get the index of the specified header */
            index = headerList.indexOf(headerName);
        }
    }

    return index;
}





/*------------------------------------------------------------------*/





/* 
    拿到指定 sheet 
    的指定 column 
    的整个竖列的 data
    (回传的 list 不包括 header)
*/
/*
    Get all data in the specified column
    of the specified sheet
    (the returned list does not include the header)
*/
function getDataOfColumn(sheetName, headerName, toLowerCase) {
    toLowerCase = (toLowerCase === true || toLowerCase === "true");

    let columnData = null;

    if (sheetName && headerName) {

        /* 拿到指定 sheet 的全部 data */
        /* Get all data from the specified sheet */
        const allData = getAllSheetData(sheetName); 

        if (allData) {

            /* 检查该指定 header 是否存在该指定 sheet */
            /* Check whether the specified header exists in the specified sheet */
            const targetIndex = getIndexOfHeader(sheetName, headerName);

            /* targetIndex = -1 代表 sheetName 或 headerName 不存在 */
            /* targetIndex = -1 means that sheetName or headerName does not exist */
            if (targetIndex !== -1) {
                columnData = [];

                for (let i = 0; i < allData.length; i++) {

                    /* 
                        用 trim() 去除最前面和最后面的空格 
                        (" example".trim() -> "example")
                        ("example ".trim() -> "example")
                    */
                    /*
                        Use trim() to remove leading and trailing spaces
                        (" example".trim() -> "example")
                        ("example ".trim() -> "example")
                    */
                    let data = allData[i][targetIndex].trim();

                    /* 检查要回传的 data 是否需要全部小写 */
                    /* Check whether the returned data should be converted to lowercase */
                    data = toLowerCase ? data.toLowerCase() : data;

                    /* 把经过处理的 data 放进 list 的最后面 */
                    /* Append the processed data to the end of the list */
                    columnData.push(data);
                }

                /* 把第一个元素拿掉因为是 header */
                /* Remove the first element because it is the header */
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
/*
    Get the specified cell
    (other methods can be used on this cell,
    such as .getValue() and .setValue())
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
        /*
            + 1 because Google Sheets indexes start at 1
            + 2 to avoid selecting the header
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





/* 拿到指定 sheet 里的指定单元格的 data */
/* Get the data from the specified cell in the specified sheet */
function getDataOfCell(sheetName, headerName, targetRowIndex) {
    let cellData = null;

    if (
        sheetName && 
        headerName && 
        !isNaN(targetRowIndex) && 
        targetRowIndex >= 0
    ) {

        /* 检查该 header 是否存在与指定 sheet 里 */
        const targetColumnIndex = getIndexOfHeader(sheetName, headerName);

        /* targetColumnIndex = -1 代表 sheetName 或 headerName 不存在 */
        if (targetColumnIndex !== -1) {
            cellData = getCell(sheetName, targetRowIndex, targetColumnIndex)
                .getValue();
        }
    }

    return cellData;
}