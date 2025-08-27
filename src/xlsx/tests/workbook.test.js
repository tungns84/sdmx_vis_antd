import { createExcelWorkbook } from '../';
import data from './mocks';

describe('Excel Workbook', () => {
  test('workbook snapshot', () =>
    createExcelWorkbook(data).then((workbook) => {
      // Tab
      expect(workbook._sheets.length).toBe(2);

      // Header
      expect(workbook.sheet(0).cell('B1').value()).toBe(
        'Emissions of air pollutants',
      );
      expect(workbook.sheet(0).cell('B2').value()).toBe(
        'Units of Measure: 1990=100',
      );

      // Section length
      expect(workbook.sheet(0).row('6').height()).toBe(14.4);
      expect(workbook.sheet(0).row('7').height()).toBe(28.8);

      // Cell width
      expect(workbook.sheet(0).column('C').width()).toBe(10); // min-size
      expect(workbook.sheet(0).column('B').width()).toBe(13);

      // numberFormat
      expect(workbook.sheet(0).cell('D8').style('numberFormat')).toBe(
        '#,##0.000',
      );

      // title header merge
      expect(workbook.sheet(0).range('B4:C4').merged()).toBe(true);

      // section merge
      expect(workbook.sheet(0).range('B6:D6').merged()).toBe(true);
      expect(workbook.sheet(0).range('B7:D7').merged()).toBe(true);
      expect(workbook.sheet(0).range('E6:E7').merged()).toBe(true);

      // comments value
      expect(workbook.sheet(0).cell('D17').value()).toBe(181.491);

      expect(workbook.sheet(0)._comments['D17']).toStrictEqual({
        text: 'Observation: test',
        width: '400pt',
        height: '50pt',
        column: 4,
        row: 17,
        horizontalAlignment: 'Left',
        textAlign: 'left',
      });
    }));
});
