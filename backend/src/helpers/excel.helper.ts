import * as Excel from 'exceljs';

export async function responseExcel(res, data: string[][] | any[] | Excel.Workbook, fileName: string = 'excel') {
    const workbook = data instanceof Excel.Workbook ? data : generateExcelWorkbook(data);
    res.attachment(`${fileName}.xlsx`);
    await workbook.xlsx.write(res);
    await res.end();
}

export async function responseCSV(res, data: string[][] | any[] | Excel.Workbook, fileName: string = 'csv') {
    const workbook = data instanceof Excel.Workbook ? data : generateExcelWorkbook(data);
    res.attachment(`${fileName}.csv`);
    res.writeHead(200, {
        'Content-Type': 'data:text/csv;charset=utf-8,%EF%BB%BF',
    });
    res.write(Buffer.from('EFBBBF', 'hex')); // BOM header
    const buffer = await workbook.csv.writeBuffer();
    const csv = '\uFEFF' + buffer.toString();
    await res.end(csv);
}

export function generateExcelWorkbook(data: string[][] | any[]): Excel.Workbook {
    if (Array.isArray(data[0])) {
        // string[][]
        return exportStringMatrixToExcelWorkbook(data);
    }
    // any[]
    return exportObjectListToExcelWorkbook(data);
}

function exportStringMatrixToExcelWorkbook(data: string[][]): Excel.Workbook {
    // first line need to be headers
    const headers = data[0];
    const rows = data.slice(1);

    const excelData: any[] = [];
    for (const row of rows) {
        const excelRowData = {};
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const colName = headers[colIndex];
            excelRowData[colName] = row[colIndex];
        }
        excelData.push(excelRowData);
    }
    return exportObjectListToExcelWorkbook(excelData);
}

function exportObjectListToExcelWorkbook(data: any[]): Excel.Workbook {
    const workbook = new Excel.Workbook();
    workbook.creator = 'Altshuler';
    workbook.lastModifiedBy = 'Altshuler';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.lastPrinted = new Date();
    workbook.properties.date1904 = true;

    workbook.views = [
        {
            x: 0,
            y: 0,
            width: 10000,
            height: 20000,
            firstSheet: 0,
            activeTab: 1,
            visibility: 'visible',
        },
    ];

    const headers = Object.keys(data[0]);
    const worksheet = workbook.addWorksheet('Sheet', { views: [{ xSplit: 1, ySplit: 1 }] });

    worksheet.autoFilter = {
        from: 'A1',
        to: {
            row: 1,
            column: headers.length,
        },
    };

    worksheet.columns = headers.map(header => ({ header, key: header }));
    worksheet.addRows(data);

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };

    for (let col = 1; col < headers.length + 1; col++) {
        const cell = headerRow.getCell(col);
        cell.fill = {
            type: 'gradient',
            gradient: 'path',
            center: { left: 0.5, top: 0.5 },
            stops: [
                { position: 0, color: { argb: '3399ff' } },
                { position: 1, color: { argb: '3399ff' } },
            ],
        };
    }

    const borderStyle: Partial<Excel.Borders> = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
    };

    for (let rowNumber = 1; rowNumber < worksheet.rowCount + 1; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        for (let col = 1; col < headers.length + 1; col++) {
            const cell = row.getCell(col);
            cell.border = borderStyle;
        }
    }

    return workbook;
}
