
/**
 * json转excel
 * @param JSONData
 * @param FileName 保存文件名
 */
function JSONToExcelConvertor(JSONData, FileName) {  
    //先转化json  
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;  
    var excel = '<table>';   
    //设置表前  
    var row = "<tr>";           
    var heads = Object.keys(JSONData[0]);  

    heads.forEach(function (item) {
        console.log(JSONData[0][item])
        row += "<td>" + JSONData[0][item] + '</td>';
    });     
    excel += row + "</tr>";  
    row = "<tr>";           
    heads.forEach(function (item) {
        console.log(JSONData[1][item])
        row += "<td>" + JSONData[1][item] + '</td>';
    });     
    excel += row + "</tr>";  
    //设置表头  
    row = "<tr>";     
    var keys = Object.keys(JSONData[0]);  
    keys.forEach(function (item) {
        row += "<td>" + item + '</td>';
    });     
    //换行  
    excel += row + "</tr>";  
    //设置数据
    for (var i = 2; i < arrData.length; i++) {  
        var row = "<tr>";  
        for (var index in arrData[i]) {  
            console.log(arrData[i][index]);
            //var value = arrData[i][index] === "." ? "" : arrData[i][index];  
            row += '<td>' + arrData[i][index] + '</td>';  
        }  
        excel += row + "</tr>";  
    }  

    excel += "</table>";  

    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";  
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';  
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';  
    excelFile += '; charset=UTF-8">';  
    excelFile += "<head>";  
    excelFile += "<!--[if gte mso 9]>";  
    excelFile += "<xml>";  
    excelFile += "<x:ExcelWorkbook>";  
    excelFile += "<x:ExcelWorksheets>";  
    excelFile += "<x:ExcelWorksheet>";  
    excelFile += "<x:Name>";  
    excelFile += FileName;  
    excelFile += "</x:Name>";  
    excelFile += "<x:WorksheetOptions>";  
    excelFile += "<x:DisplayGridlines/>";  
    excelFile += "</x:WorksheetOptions>";  
    excelFile += "</x:ExcelWorksheet>";  
    excelFile += "</x:ExcelWorksheets>";  
    excelFile += "</x:ExcelWorkbook>";  
    excelFile += "</xml>";  
    excelFile += "<![endif]-->";  
    excelFile += "</head>";  
    excelFile += "<body>";  
    excelFile += excel;  
    excelFile += "</body>";  
    excelFile += "</html>";  

    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);  

    var link = document.createElement("a");      
    link.href = uri;  

    // (link as HTMLElement).style = "visibility:hidden";  ]
    link.setAttribute('style',"visibility:hidden")
    link.download = FileName + ".xls";  

    document.body.appendChild(link);  
    link.click();  
    document.body.removeChild(link);  
}
/**
 * csv转sheet
 * @param csv
 */
function csv2sheet(csv) {
    var sheet = {}; // 将要生成的sheet
    csv = csv.split('\n');
    csv.forEach(function(row, i) {
        row = row.split(',');
        if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
        row.forEach(function(col, j) {
            sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
        });
    });
    return sheet;
}

/**
 * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
 * @param sheet
 * @param sheetName
 */
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}
/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName)
{
    if(typeof url == 'object' && url instanceof Blob)
    {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if(window.MouseEvent) event = new MouseEvent('click');
    else
    {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}
/**
 * csv => excel
 * @param csv
 * @param saveName 保存文件名，可选
 */
function CsvToExcel(csv, saveName) {
    var sheet = csv2sheet(csv);
    var blob = sheet2blob(sheet);
    openDownloadDialog(blob, `${saveName}.xlsx`)
}

/**
 * json => excel
 * @param json 
 * @param saveName 保存文件名，可选
 */
function JsonToExcel(json, saveName) {
    var sheet = json2sheet(csv);
    var blob = sheet2blob(sheet);
    openDownloadDialog(blob, `${saveName}.xlsx`)
}
export {JSONToExcelConvertor}