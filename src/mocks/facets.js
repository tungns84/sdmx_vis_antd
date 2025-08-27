export default {
  topic_s: {
    name: 'OECD:OECDCS1(1.0)',
    value: 'Dissemination category scheme',
    type: 'Category',
    order: 1,
    facetValues: [
      { name: 'OECDCS1|ECO', value: 'Economy and finance', count: 6 },
      { name: 'OECDCS1|AGRI', value: 'Agriculture and fisheries', count: 4 },
      { name: 'OECDCS1|SOC', value: 'Social conditions', count: 4 },
      { name: 'OECDCS1|DEMO', value: 'Demography and population', count: 3 },
      {
        name: 'OECDCS1|DEMO/OECDCS1|DEMO.DEMO2',
        value: 'Demography and population/Population',
        count: 3,
      },
    ],
  },
  dim_REF_AREA_s: {
    name: 'REF_AREA',
    value: 'Reference area',
    type: 'Dimension',
    order: 2,
    facetValues: [
      { name: 'EE', value: 'ESTONIA', count: 2 },
      { name: 'FR', value: 'FRANCE', count: 2 },
      { name: 'ES', value: 'SPAIN', count: 1 },
    ],
  },
  dim_ACTIVITY_s: {
    name: 'ACTIVITY',
    value: 'Economic activity',
    type: 'Dimension',
    order: 3,
    facetValues: [
      {
        name: 'GDP',
        value: 'Gross domestic product',
        count: 10,
      },
      {
        name: 'GDP/B1_GA',
        value: 'Gross domestic product/GDP: Output approach',
        count: 2,
      },
      {
        name: 'GDP/B1_GA/D1',
        value:
          'Gross domestic product/GDP: Output approach/Compensation of employees',
        count: 2,
      },
      {
        name: 'GDP/B1_GA/D1/D1VA',
        value:
          'Gross domestic product/GDP: Output approach/Compensation of employees/Agriculture, forestry and fishing (ISIC rev4)',
        count: 2,
      },
      {
        name: 'GDP/B1_GA/D1/D1VF',
        value:
          'Gross domestic product/GDP: Output approach/Compensation of employees/Construction (ISIC rev4)',
        count: 2,
      },
      {
        name: 'GDP/B1_GA/D1/D1VG_I',
        value:
          'Gross domestic product/GDP: Output approach/Compensation of employees/Distributive trade, repairs; transport; accommod., food serv. (ISIC rev4)',
        count: 2,
      },
    ],
  },
};
