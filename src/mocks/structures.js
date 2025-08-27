export default {
  meta: {
    schema:
      'https://raw.githubusercontent.com/sdmx-twg/sdmx-json/develop/structure-message/tools/schemas/1.0/sdmx-json-structure-schema.json',
    id: 'IDREF401067',
    test: false,
    prepared: '2018-03-17T20:00:51',
    'content-languages': ['en'],
    sender: {
      id: 'ECB',
    },
    receivers: [
      {
        id: 'not_supplied',
      },
    ],
    links: [
      {
        href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0?references=all',
        rel: 'self',
        hreflang: 'en',
      },
    ],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        dataStructureComponents: {
          attributeList: {
            id: 'AttributeDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.AttributeDescriptor=ECB:ECB_EXR1(1.0).AttributeDescriptor',
                hreflang: 'en',
              },
            ],
            attributes: [
              {
                id: 'TIME_FORMAT',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=ECB:ECB_EXR1(1.0).TIME_FORMAT',
                    hreflang: 'en',
                  },
                ],
                assignmentStatus: 'Mandatory',
                attributeRelationship: {
                  dimensions: [
                    'FREQ',
                    'CURRENCY',
                    'CURRENCY_DENOM',
                    'EXR_TYPE',
                    'EXR_SUFFIX',
                  ],
                },
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_FORMAT',
                conceptRoles: ['TIME_FORMAT'],
                localRepresentation: {
                  textFormat: {
                    maxLength: 3,
                    minLength: 3,
                    textType: 'String',
                  },
                },
              },
              {
                id: 'OBS_CONF',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=ECB:ECB_EXR1(1.0).OBS_CONF',
                    hreflang: 'en',
                  },
                ],
                assignmentStatus: 'Conditional',
                attributeRelationship: {
                  primaryMeasure: 'OBS_VALUE',
                },
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_CONF',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_OBS_CONF(1.0)',
                },
              },
            ],
          },
          dimensionList: {
            id: 'DimensionDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DimensionDescriptor=ECB:ECB_EXR1(1.0).DimensionDescriptor',
                hreflang: 'en',
              },
            ],
            dimensions: [
              {
                id: 'FREQ',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).FREQ',
                    hreflang: 'en',
                  },
                ],
                position: 1,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
              {
                id: 'CURRENCY',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).CURRENCY',
                    hreflang: 'en',
                  },
                ],
                position: 2,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'CURRENCY_DENOM',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).CURRENCY_DENOM',
                    hreflang: 'en',
                  },
                ],
                position: 3,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY_DENOM',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'EXR_TYPE',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).EXR_TYPE',
                    hreflang: 'en',
                  },
                ],
                position: 4,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_TYPE',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0)',
                },
              },
              {
                id: 'EXR_SUFFIX',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).EXR_SUFFIX',
                    hreflang: 'en',
                  },
                ],
                position: 5,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_SUFFIX',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0)',
                },
              },
            ],
            timeDimensions: [
              {
                id: 'TIME_PERIOD',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.TimeDimension=ECB:ECB_EXR1(1.0).TIME_PERIOD',
                    hreflang: 'en',
                  },
                ],
                position: 6,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_PERIOD',
                localRepresentation: {
                  textFormat: {
                    textType: 'ObservationalTimePeriod',
                  },
                },
              },
            ],
          },
          groups: [
            {
              id: 'Group',
              links: [
                {
                  rel: 'self',
                  urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.GroupDimensionDescriptor=ECB:ECB_EXR1(1.0).Group',
                  hreflang: 'en',
                },
              ],
              groupDimensions: [
                'CURRENCY',
                'CURRENCY_DENOM',
                'EXR_TYPE',
                'EXR_SUFFIX',
              ],
            },
          ],
          measureList: {
            id: 'MeasureDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.MeasureDescriptor=ECB:ECB_EXR1(1.0).MeasureDescriptor',
                hreflang: 'en',
              },
            ],
            primaryMeasure: {
              id: 'OBS_VALUE',
              links: [
                {
                  rel: 'self',
                  urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.PrimaryMeasure=ECB:ECB_EXR1(1.0).OBS_VALUE',
                  hreflang: 'en',
                },
              ],
              conceptIdentity:
                'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_VALUE',
            },
          },
        },
      },
    ],
    categorySchemes: [
      {
        id: 'MOBILE_NAVI',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: true,
        isFinal: false,
        name: {
          en: 'Economic concepts',
        },
        description: {
          en: 'This category scheme is used for the Data Explorer of the ECB SDW mobile application. It is used for grouping all dataflows following the top-level categories displayed on the SDW portal.',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.CategoryScheme=ECB:MOBILE_NAVI(1.0)',
            type: 'categoryscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        categories: [
          {
            id: '00',
            name: {
              en: 'Parent category',
            },
            description: {
              en: 'Parent category example',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0/00',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.CategoryScheme=ECB:MOBILE_NAVI(1.0).00',
                type: 'category',
                hreflang: 'en',
              },
            ],
            categories: [
              {
                id: '07',
                name: {
                  en: 'Exchange rates',
                },
                description: {
                  en: 'This section shows the euro foreign exchange reference rates that are based on the regular daily concertation procedure between central banks within and outside the European System of Central Banks, which normally takes place at 2.15 p.m. ECB time (CET). It also shows the nominal effective exchange rates of the euro as calculated by the ECB.',
                },
                links: [
                  {
                    href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0/07',
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.Category=ECB:MOBILE_NAVI(1.0).07',
                    type: 'category',
                    hreflang: 'en',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'ECB concepts',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0)',
            type: 'conceptscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        concepts: [
          {
            id: 'CURRENCY',
            name: {
              en: 'Currency',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/CURRENCY',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0).CURRENCY',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/FREQ',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'CURRENCY_DENOM',
            name: {
              en: 'Currency denominator',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/CURRENCY_DENOM',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0).CURRENCY_DENOM',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EXR_TYPE',
            name: {
              en: 'Exchange rate type',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/EXR_TYPE',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_TYPE',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EXR_SUFFIX',
            name: {
              en: 'Series variation - EXR context',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/EXR_SUFFIX',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_SUFFIX',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'TIME_FORMAT',
            name: {
              en: 'Time format code',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/TIME_FORMAT',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_FORMAT',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'OBS_CONF',
            name: {
              en: 'Observation confidentiality',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/OBS_CONF',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_CONF',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'OBS_VALUE',
            name: {
              en: 'OBS_VALUE',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/OBS_VALUE',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_VALUE',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Frequency code list',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_FREQ/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
            type: 'codelist',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_FREQ/1.0/A',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0).A',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_FREQ/1.0/M',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0).M',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_FREQ/1.0/Q',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0).Q',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
      {
        id: 'CL_CURRENCY',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Currency code list',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_CURRENCY/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
            type: 'codelist',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        codes: [
          {
            id: '_T',
            name: {
              en: 'All currencies',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_CURRENCY/1.0/_T',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)._T',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EUR',
            name: {
              en: 'Euro',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_CURRENCY/1.0/EUR',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0).EUR',
                type: 'code',
                hreflang: 'en',
              },
            ],
            parent: '_T',
          },
        ],
      },
      {
        id: 'CL_OBS_CONF',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Currency code list',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_OBS_CONF/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_OBS_CONF(1.0)',
            type: 'codelist',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        codes: [
          {
            id: 'F',
            name: {
              en: 'Free',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_OBS_CONF/1.0/F',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_OBS_CONF(1.0).F',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
      {
        id: 'CL_EXR_SUFFIX',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exch. rate series variation code list',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0)',
            type: 'codelist',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        codes: [
          {
            id: 'A',
            name: {
              en: 'Average',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0/A',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0).A',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'E',
            name: {
              en: 'End-of-period',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0/E',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0).E',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'P',
            name: {
              en: 'Growth rate to previous period',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0/P',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0).P',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'R',
            name: {
              en: 'Annual rate of change',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0/R',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0).R',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'S',
            name: {
              en: 'Percentage change since December 1998 (1998Q4 for quarterly data)',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0/S',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0).S',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'T',
            name: {
              en: '3-year percentage change',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0/T',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0).T',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
      {
        id: 'CL_EXR_TYPE',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exch. rate series variation code list',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_TYPE/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0)',
            type: 'codelist',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        codes: [
          {
            id: 'NRP0',
            name: {
              en: 'Real harmonised competitiveness indicator Producer Prices deflated',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_TYPE/1.0/NRP0',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0).NRP0',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'ERU1',
            name: {
              en: 'Real effective exch. rate ULC total economy deflated',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_TYPE/1.0/ERU1',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0).ERU1',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'ERC0',
            name: {
              en: 'Real effective exch. rate CPI deflated',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_TYPE/1.0/ERC0',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0).ERC0',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'SP00',
            name: {
              en: 'Spot',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_TYPE/1.0/SP00',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0).SP00',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'RR00',
            name: {
              en: 'Reference rate',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_TYPE/1.0/RR00',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0).RR00',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EN00',
            name: {
              en: 'Nominal effective exch. rate',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_TYPE/1.0/EN00',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0).EN00',
                type: 'code',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
    ],
    agencySchemes: [
      {
        id: 'AGENCIES',
        version: '1.0',
        agencyID: 'SDMX',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'SDMX Agency Scheme',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/agencyscheme/SDMX/AGENCIES/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.base.AgencyScheme=SDMX:AGENCIES(1.0)',
            type: 'agencyscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        agencies: [
          {
            id: 'ECB',
            name: {
              en: 'European Central Bank',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/agencyscheme/SDMX/AGENCIES/1.0/ECB',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX',
                type: 'agency',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
    categorisations: [
      {
        id: '53A341E8-D48B-767E-D5FF-E2E3E0E2BB19',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Categorise: DATAFLOWECB:EXR(1.0)',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/categorisation/ECB/53A341E8-D48B-767E-D5FF-E2E3E0E2BB19/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.Categorisation=ECB:53A341E8-D48B-767E-D5FF-E2E3E0E2BB19(1.0)',
            type: 'categorisation',
            hreflang: 'en',
          },
        ],
        source:
          'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
        target:
          'urn:sdmx:org.sdmx.infomodel.categoryscheme.Category=ECB:MOBILE_NAVI(1.0).07',
      },
    ],
    constraints: [
      {
        id: 'EXR_CONSTRAINTS',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Constraints for the EXR dataflow.',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/contentconstraint/ECB/EXR_CONSTRAINTS/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.registry.ContentConstraint=ECB:EXR_CONSTRAINTS(1.0)',
            type: 'constraint',
            hreflang: 'en',
          },
        ],
        constraintAttachment: {
          dataflows: [
            'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
          ],
        },
        cubeRegions: [
          {
            isIncluded: true,
            keyValues: [
              {
                id: 'EXR_TYPE',
                values: ['NRP0', 'ERU1', 'ERC0', 'SP00'],
              },
              {
                id: 'EXR_SUFFIX',
                values: ['P', 'A', 'R', 'S', 'T', 'E'],
              },
              {
                id: 'FREQ',
                values: ['A', 'Q', 'M'],
              },
              {
                id: 'CURRENCY',
                values: ['_T', 'EUR', 'USD'],
              },
              {
                id: 'CURRENCY_DENOM',
                values: ['_T', 'EUR', 'USD'],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const mocks1 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
              {
                id: 'CURRENCY',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'CURRENCY_DENOM',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY_DENOM',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'EXR_TYPE',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_TYPE',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0)',
                },
              },
              {
                id: 'EXR_SUFFIX',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_SUFFIX',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
        },
        concepts: [
          {
            id: 'CURRENCY',
            name: {
              en: 'Currency',
            },
          },
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
            },
          },
          {
            id: 'CURRENCY_DENOM',
            name: {
              en: 'Currency denominator',
            },
          },
          {
            id: 'EXR_TYPE',
            name: {
              en: 'Exchange rate type',
            },
          },
          {
            id: 'EXR_SUFFIX',
            name: {
              en: 'Series variation - EXR context',
            },
          },
          {
            id: 'TIME_FORMAT',
            name: {
              en: 'Time format code',
            },
          },
          {
            id: 'OBS_CONF',
            name: {
              en: 'Observation confidentiality',
            },
          },
          {
            id: 'OBS_VALUE',
            name: {
              en: 'OBS_VALUE',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
            },
          },
        ],
      },
      {
        id: 'CL_CURRENCY',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Currency code list',
        },
        codes: [
          {
            id: '_T',
            name: {
              en: 'All currencies',
            },
          },
          {
            id: 'EUR',
            name: {
              en: 'Euro',
            },
            parent: '_T',
          },
        ],
      },
      {
        id: 'CL_OBS_CONF',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Currency code list',
        },
        codes: [
          {
            id: 'F',
            name: {
              en: 'Free',
            },
          },
        ],
      },
      {
        id: 'CL_EXR_SUFFIX',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Exch. rate series variation code list',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Average',
            },
          },
          {
            id: 'E',
            name: {
              en: 'End-of-period',
            },
          },
          {
            id: 'P',
            name: {
              en: 'Growth rate to previous period',
            },
          },
          {
            id: 'R',
            name: {
              en: 'Annual rate of change',
            },
          },
          {
            id: 'S',
            name: {
              en: 'Percentage change since December 1998 (1998Q4 for quarterly data)',
            },
          },
          {
            id: 'T',
            name: {
              en: '3-year percentage change',
            },
          },
        ],
      },
      {
        id: 'CL_EXR_TYPE',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Exch. rate series variation code list',
        },
        codes: [
          {
            id: 'NRP0',
            name: {
              en: 'Real harmonised competitiveness indicator Producer Prices deflated',
            },
          },
          {
            id: 'ERU1',
            name: {
              en: 'Real effective exch. rate ULC total economy deflated',
            },
          },
          {
            id: 'ERC0',
            name: {
              en: 'Real effective exch. rate CPI deflated',
            },
          },
          {
            id: 'SP00',
            name: {
              en: 'Spot',
            },
          },
          {
            id: 'RR00',
            name: {
              en: 'Reference rate',
            },
          },
          {
            id: 'EN00',
            name: {
              en: 'Nominal effective exch. rate',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks2 = {
  meta: {
    'content-languages': ['fr'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks3 = {
  meta: {},
};

export const mocks4 = {
  meta: {
    'content-languages': [],
  },
};

export const mocks5 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {},
};

export const mocks6 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks7 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks8 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks9 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks10 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks11 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity: '',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks12 = {
  meta: {
    'content-languages': ['fr'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks13 = {
  meta: {
    'content-languages': ['fr'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks14 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks15 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks16 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks17 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks18 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {},
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
        codes: [
          {
            id: 'A',
            name: {
              en: 'Annual',
              fr: 'test',
            },
          },
          {
            id: 'M',
            name: {
              en: 'Monthly',
              fr: 'test',
            },
          },
          {
            id: 'Q',
            name: {
              en: 'Quarterly',
              fr: 'test',
            },
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks19 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks20 = {
  meta: {
    'content-languages': ['en'],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
          fr: 'test',
        },
        dataStructureComponents: {
          dimensionList: {
            id: 'DimensionDescriptor',
            dimensions: [
              {
                id: 'FREQ',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Toto=ECB:CL_FREQ(1.0)',
                },
              },
            ],
          },
        },
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'ECB concepts',
          fr: 'test',
        },
        concepts: [
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
              fr: 'test',
            },
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_FREQ',
        version: '1.0',
        agencyID: 'ECB',
        name: {
          en: 'Frequency code list',
          fr: 'test',
        },
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
  },
};

export const mocks21 = {
  meta: {
    schema:
      'https://raw.githubusercontent.com/sdmx-twg/sdmx-json/develop/structure-message/tools/schemas/1.0/sdmx-json-structure-schema.json',
    id: 'IDREF401067',
    test: false,
    prepared: '2018-03-17T20:00:51',
    'content-languages': ['en'],
    sender: {
      id: 'ECB',
    },
    receivers: [
      {
        id: 'not_supplied',
      },
    ],
    links: [
      {
        href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0?references=all',
        rel: 'self',
        hreflang: 'en',
      },
    ],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        dataStructureComponents: {
          attributeList: {
            id: 'AttributeDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.AttributeDescriptor=ECB:ECB_EXR1(1.0).AttributeDescriptor',
                hreflang: 'en',
              },
            ],
            attributes: [
              {
                id: 'TIME_FORMAT',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=ECB:ECB_EXR1(1.0).TIME_FORMAT',
                    hreflang: 'en',
                  },
                ],
                assignmentStatus: 'Mandatory',
                attributeRelationship: {
                  dimensions: [
                    'FREQ',
                    'CURRENCY',
                    'CURRENCY_DENOM',
                    'EXR_TYPE',
                    'EXR_SUFFIX',
                  ],
                },
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_FORMAT',
                conceptRoles: ['TIME_FORMAT'],
                localRepresentation: {
                  textFormat: {
                    maxLength: 3,
                    minLength: 3,
                    textType: 'String',
                  },
                },
              },
              {
                id: 'OBS_CONF',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=ECB:ECB_EXR1(1.0).OBS_CONF',
                    hreflang: 'en',
                  },
                ],
                assignmentStatus: 'Conditional',
                attributeRelationship: {
                  primaryMeasure: 'OBS_VALUE',
                },
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_CONF',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_OBS_CONF(1.0)',
                },
              },
            ],
          },
          dimensionList: {
            id: 'DimensionDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DimensionDescriptor=ECB:ECB_EXR1(1.0).DimensionDescriptor',
                hreflang: 'en',
              },
            ],
            dimensions: [
              {
                id: 'FREQ',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).FREQ',
                    hreflang: 'en',
                  },
                ],
                position: 1,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
              {
                id: 'CURRENCY',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).CURRENCY',
                    hreflang: 'en',
                  },
                ],
                position: 2,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'CURRENCY_DENOM',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).CURRENCY_DENOM',
                    hreflang: 'en',
                  },
                ],
                position: 3,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY_DENOM',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'EXR_TYPE',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).EXR_TYPE',
                    hreflang: 'en',
                  },
                ],
                position: 4,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_TYPE',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0)',
                },
              },
              {
                id: 'EXR_SUFFIX',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).EXR_SUFFIX',
                    hreflang: 'en',
                  },
                ],
                position: 5,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_SUFFIX',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0)',
                },
              },
            ],
            timeDimensions: [
              {
                id: 'TIME_PERIOD',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.TimeDimension=ECB:ECB_EXR1(1.0).TIME_PERIOD',
                    hreflang: 'en',
                  },
                ],
                position: 6,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_PERIOD',
                localRepresentation: {
                  textFormat: {
                    textType: 'ObservationalTimePeriod',
                  },
                },
              },
            ],
          },
          groups: [
            {
              id: 'Group',
              links: [
                {
                  rel: 'self',
                  urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.GroupDimensionDescriptor=ECB:ECB_EXR1(1.0).Group',
                  hreflang: 'en',
                },
              ],
              groupDimensions: [
                'CURRENCY',
                'CURRENCY_DENOM',
                'EXR_TYPE',
                'EXR_SUFFIX',
              ],
            },
          ],
          measureList: {
            id: 'MeasureDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.MeasureDescriptor=ECB:ECB_EXR1(1.0).MeasureDescriptor',
                hreflang: 'en',
              },
            ],
            primaryMeasure: {
              id: 'OBS_VALUE',
              links: [
                {
                  rel: 'self',
                  urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.PrimaryMeasure=ECB:ECB_EXR1(1.0).OBS_VALUE',
                  hreflang: 'en',
                },
              ],
              conceptIdentity:
                'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_VALUE',
            },
          },
        },
      },
    ],
    categorySchemes: [
      {
        id: 'MOBILE_NAVI',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: true,
        isFinal: false,
        name: {
          en: 'Economic concepts',
        },
        description: {
          en: 'This category scheme is used for the Data Explorer of the ECB SDW mobile application. It is used for grouping all dataflows following the top-level categories displayed on the SDW portal.',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.CategoryScheme=ECB:MOBILE_NAVI(1.0)',
            type: 'categoryscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        categories: [
          {
            id: '00',
            name: {
              en: 'Parent category',
            },
            description: {
              en: 'Parent category example',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0/00',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.CategoryScheme=ECB:MOBILE_NAVI(1.0).00',
                type: 'category',
                hreflang: 'en',
              },
            ],
            categories: [
              {
                id: '07',
                name: {
                  en: 'Exchange rates',
                },
                description: {
                  en: 'This section shows the euro foreign exchange reference rates that are based on the regular daily concertation procedure between central banks within and outside the European System of Central Banks, which normally takes place at 2.15 p.m. ECB time (CET). It also shows the nominal effective exchange rates of the euro as calculated by the ECB.',
                },
                links: [
                  {
                    href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0/07',
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.Category=ECB:MOBILE_NAVI(1.0).07',
                    type: 'category',
                    hreflang: 'en',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'ECB concepts',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0)',
            type: 'conceptscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        concepts: [
          {
            id: 'CURRENCY',
            name: {
              en: 'Currency',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/CURRENCY',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0).CURRENCY',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/FREQ',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'CURRENCY_DENOM',
            name: {
              en: 'Currency denominator',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/CURRENCY_DENOM',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0).CURRENCY_DENOM',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EXR_TYPE',
            name: {
              en: 'Exchange rate type',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/EXR_TYPE',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_TYPE',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EXR_SUFFIX',
            name: {
              en: 'Series variation - EXR context',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/EXR_SUFFIX',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_SUFFIX',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'TIME_FORMAT',
            name: {
              en: 'Time format code',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/TIME_FORMAT',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_FORMAT',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'OBS_CONF',
            name: {
              en: 'Observation confidentiality',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/OBS_CONF',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_CONF',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'OBS_VALUE',
            name: {
              en: 'OBS_VALUE',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/OBS_VALUE',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_VALUE',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_EXR_SUFFIX',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exch. rate series variation code list',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0)',
            type: 'codelist',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        codes: [
          {
            id: '01',
            name: {
              en: 'All currencies',
            },
          },
          {
            id: '10',
            name: {
              en: 'Euro',
            },
            parent: '01',
          },
          {
            id: '100',
            name: {
              en: 'hundred',
            },
            parent: '10',
          },
          {
            id: '1000',
            name: {
              en: 'thousand',
            },
            parent: '100',
          },
          {
            id: '10000',
            name: {
              en: 'ten thousand',
            },
            parent: '1000',
          },
        ],
      },
    ],
    agencySchemes: [
      {
        id: 'AGENCIES',
        version: '1.0',
        agencyID: 'SDMX',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'SDMX Agency Scheme',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/agencyscheme/SDMX/AGENCIES/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.base.AgencyScheme=SDMX:AGENCIES(1.0)',
            type: 'agencyscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        agencies: [
          {
            id: 'ECB',
            name: {
              en: 'European Central Bank',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/agencyscheme/SDMX/AGENCIES/1.0/ECB',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX',
                type: 'agency',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
    categorisations: [
      {
        id: '53A341E8-D48B-767E-D5FF-E2E3E0E2BB19',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Categorise: DATAFLOWECB:EXR(1.0)',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/categorisation/ECB/53A341E8-D48B-767E-D5FF-E2E3E0E2BB19/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.Categorisation=ECB:53A341E8-D48B-767E-D5FF-E2E3E0E2BB19(1.0)',
            type: 'categorisation',
            hreflang: 'en',
          },
        ],
        source:
          'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
        target:
          'urn:sdmx:org.sdmx.infomodel.categoryscheme.Category=ECB:MOBILE_NAVI(1.0).07',
      },
    ],
    constraints: [
      {
        id: 'EXR_CONSTRAINTS',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Constraints for the EXR dataflow.',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/contentconstraint/ECB/EXR_CONSTRAINTS/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.registry.ContentConstraint=ECB:EXR_CONSTRAINTS(1.0)',
            type: 'constraint',
            hreflang: 'en',
          },
        ],
        constraintAttachment: {
          dataflows: [
            'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
          ],
        },
        cubeRegions: [
          {
            isIncluded: true,
            keyValues: [
              {
                id: 'EXR_TYPE',
                values: ['NRP0', 'ERU1', 'ERC0', 'SP00'],
              },
              {
                id: 'EXR_SUFFIX',
                values: ['P', 'A', 'R', 'S', 'T', 'E'],
              },
              {
                id: 'FREQ',
                values: ['A', 'Q', 'M'],
              },
              {
                id: 'CURRENCY',
                values: ['_T', 'EUR', 'USD'],
              },
              {
                id: 'CURRENCY_DENOM',
                values: ['_T', 'EUR', 'USD'],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const mocks24 = {
  meta: {
    schema:
      'https://raw.githubusercontent.com/sdmx-twg/sdmx-json/develop/structure-message/tools/schemas/1.0/sdmx-json-structure-schema.json',
    id: 'IDREF401067',
    test: false,
    prepared: '2018-03-17T20:00:51',
    'content-languages': ['en'],
    sender: {
      id: 'ECB',
    },
    receivers: [
      {
        id: 'not_supplied',
      },
    ],
    links: [
      {
        href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0?references=all',
        rel: 'self',
        hreflang: 'en',
      },
    ],
  },
  data: {
    dataStructures: [
      {
        id: 'ECB_EXR1',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exchange Rates',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        dataStructureComponents: {
          attributeList: {
            id: 'AttributeDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.AttributeDescriptor=ECB:ECB_EXR1(1.0).AttributeDescriptor',
                hreflang: 'en',
              },
            ],
            attributes: [
              {
                id: 'TIME_FORMAT',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=ECB:ECB_EXR1(1.0).TIME_FORMAT',
                    hreflang: 'en',
                  },
                ],
                assignmentStatus: 'Mandatory',
                attributeRelationship: {
                  dimensions: [
                    'FREQ',
                    'CURRENCY',
                    'CURRENCY_DENOM',
                    'EXR_TYPE',
                    'EXR_SUFFIX',
                  ],
                },
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_FORMAT',
                conceptRoles: ['TIME_FORMAT'],
                localRepresentation: {
                  textFormat: {
                    maxLength: 3,
                    minLength: 3,
                    textType: 'String',
                  },
                },
              },
              {
                id: 'OBS_CONF',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=ECB:ECB_EXR1(1.0).OBS_CONF',
                    hreflang: 'en',
                  },
                ],
                assignmentStatus: 'Conditional',
                attributeRelationship: {
                  primaryMeasure: 'OBS_VALUE',
                },
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_CONF',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_OBS_CONF(1.0)',
                },
              },
            ],
          },
          dimensionList: {
            id: 'DimensionDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DimensionDescriptor=ECB:ECB_EXR1(1.0).DimensionDescriptor',
                hreflang: 'en',
              },
            ],
            dimensions: [
              {
                id: 'FREQ',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).FREQ',
                    hreflang: 'en',
                  },
                ],
                position: 1,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                conceptRoles: ['FREQ'],
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_FREQ(1.0)',
                },
              },
              {
                id: 'CURRENCY',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).CURRENCY',
                    hreflang: 'en',
                  },
                ],
                position: 2,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'CURRENCY_DENOM',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).CURRENCY_DENOM',
                    hreflang: 'en',
                  },
                ],
                position: 3,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).CURRENCY_DENOM',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_CURRENCY(1.0)',
                },
              },
              {
                id: 'EXR_TYPE',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).EXR_TYPE',
                    hreflang: 'en',
                  },
                ],
                position: 4,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_TYPE',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_TYPE(1.0)',
                },
              },
              {
                id: 'EXR_SUFFIX',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=ECB:ECB_EXR1(1.0).EXR_SUFFIX',
                    hreflang: 'en',
                  },
                ],
                position: 5,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_SUFFIX',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0)',
                },
              },
            ],
            timeDimensions: [
              {
                id: 'TIME_PERIOD',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.TimeDimension=ECB:ECB_EXR1(1.0).TIME_PERIOD',
                    hreflang: 'en',
                  },
                ],
                position: 6,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_PERIOD',
                localRepresentation: {
                  textFormat: {
                    textType: 'ObservationalTimePeriod',
                  },
                },
              },
            ],
          },
          groups: [
            {
              id: 'Group',
              links: [
                {
                  rel: 'self',
                  urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.GroupDimensionDescriptor=ECB:ECB_EXR1(1.0).Group',
                  hreflang: 'en',
                },
              ],
              groupDimensions: [
                'CURRENCY',
                'CURRENCY_DENOM',
                'EXR_TYPE',
                'EXR_SUFFIX',
              ],
            },
          ],
          measureList: {
            id: 'MeasureDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.MeasureDescriptor=ECB:ECB_EXR1(1.0).MeasureDescriptor',
                hreflang: 'en',
              },
            ],
            primaryMeasure: {
              id: 'OBS_VALUE',
              links: [
                {
                  rel: 'self',
                  urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.PrimaryMeasure=ECB:ECB_EXR1(1.0).OBS_VALUE',
                  hreflang: 'en',
                },
              ],
              conceptIdentity:
                'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_VALUE',
            },
          },
        },
      },
    ],
    categorySchemes: [
      {
        id: 'MOBILE_NAVI',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: true,
        isFinal: false,
        name: {
          en: 'Economic concepts',
        },
        description: {
          en: 'This category scheme is used for the Data Explorer of the ECB SDW mobile application. It is used for grouping all dataflows following the top-level categories displayed on the SDW portal.',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.CategoryScheme=ECB:MOBILE_NAVI(1.0)',
            type: 'categoryscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        categories: [
          {
            id: '00',
            name: {
              en: 'Parent category',
            },
            description: {
              en: 'Parent category example',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0/00',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.CategoryScheme=ECB:MOBILE_NAVI(1.0).00',
                type: 'category',
                hreflang: 'en',
              },
            ],
            categories: [
              {
                id: '07',
                name: {
                  en: 'Exchange rates',
                },
                description: {
                  en: 'This section shows the euro foreign exchange reference rates that are based on the regular daily concertation procedure between central banks within and outside the European System of Central Banks, which normally takes place at 2.15 p.m. ECB time (CET). It also shows the nominal effective exchange rates of the euro as calculated by the ECB.',
                },
                links: [
                  {
                    href: 'https://sdw-wsrest.ecb.europa.eu/service/categoryscheme/ECB/MOBILE_NAVI/1.0/07',
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.Category=ECB:MOBILE_NAVI(1.0).07',
                    type: 'category',
                    hreflang: 'en',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    conceptSchemes: [
      {
        id: 'ECB_CONCEPTS',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'ECB concepts',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0)',
            type: 'conceptscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        concepts: [
          {
            id: 'CURRENCY',
            name: {
              en: 'Currency',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/CURRENCY',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0).CURRENCY',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'FREQ',
            name: {
              en: 'Frequency',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/FREQ',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).FREQ',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'CURRENCY_DENOM',
            name: {
              en: 'Currency denominator',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/CURRENCY_DENOM',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=ECB:ECB_CONCEPTS(1.0).CURRENCY_DENOM',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EXR_TYPE',
            name: {
              en: 'Exchange rate type',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/EXR_TYPE',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_TYPE',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'EXR_SUFFIX',
            name: {
              en: '',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/EXR_SUFFIX',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).EXR_SUFFIX',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'TIME_FORMAT',
            name: {
              en: 'Time format code',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/TIME_FORMAT',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).TIME_FORMAT',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'OBS_CONF',
            name: {
              en: 'Observation confidentiality',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/OBS_CONF',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_CONF',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
          {
            id: 'OBS_VALUE',
            name: {
              en: 'OBS_VALUE',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/conceptscheme/ECB/ECB_CONCEPTS/1.0/OBS_VALUE',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=ECB:ECB_CONCEPTS(1.0).OBS_VALUE',
                type: 'concept',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_EXR_SUFFIX',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Exch. rate series variation code list',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/codelist/ECB/CL_EXR_SUFFIX/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=ECB:CL_EXR_SUFFIX(1.0)',
            type: 'codelist',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        codes: [
          {
            id: '01',
            name: {
              en: '',
            },
          },
        ],
      },
    ],
    agencySchemes: [
      {
        id: 'AGENCIES',
        version: '1.0',
        agencyID: 'SDMX',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'SDMX Agency Scheme',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/agencyscheme/SDMX/AGENCIES/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.base.AgencyScheme=SDMX:AGENCIES(1.0)',
            type: 'agencyscheme',
            hreflang: 'en',
          },
        ],
        isPartial: true,
        agencies: [
          {
            id: 'ECB',
            name: {
              en: 'European Central Bank',
            },
            links: [
              {
                href: 'https://sdw-wsrest.ecb.europa.eu/service/agencyscheme/SDMX/AGENCIES/1.0/ECB',
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.base.Agency=SDMX',
                type: 'agency',
                hreflang: 'en',
              },
            ],
          },
        ],
      },
    ],
    dataflows: [
      {
        id: 'EXR',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: '',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/dataflow/ECB/EXR/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
            type: 'dataflow',
            hreflang: 'en',
          },
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/datastructure/ECB/ECB_EXR1/1.0',
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
            type: 'datastructure',
            hreflang: 'en',
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=ECB:ECB_EXR1(1.0)',
      },
    ],
    categorisations: [
      {
        id: '53A341E8-D48B-767E-D5FF-E2E3E0E2BB19',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Categorise: DATAFLOWECB:EXR(1.0)',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/categorisation/ECB/53A341E8-D48B-767E-D5FF-E2E3E0E2BB19/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.categoryscheme.Categorisation=ECB:53A341E8-D48B-767E-D5FF-E2E3E0E2BB19(1.0)',
            type: 'categorisation',
            hreflang: 'en',
          },
        ],
        source:
          'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
        target:
          'urn:sdmx:org.sdmx.infomodel.categoryscheme.Category=ECB:MOBILE_NAVI(1.0).07',
      },
    ],
    constraints: [
      {
        id: 'EXR_CONSTRAINTS',
        version: '1.0',
        agencyID: 'ECB',
        isExternalReference: false,
        isFinal: false,
        name: {
          en: 'Constraints for the EXR dataflow.',
        },
        links: [
          {
            href: 'https://sdw-wsrest.ecb.europa.eu/service/contentconstraint/ECB/EXR_CONSTRAINTS/1.0',
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.registry.ContentConstraint=ECB:EXR_CONSTRAINTS(1.0)',
            type: 'constraint',
            hreflang: 'en',
          },
        ],
        constraintAttachment: {
          dataflows: [
            'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=ECB:EXR(1.0)',
          ],
        },
        cubeRegions: [
          {
            isIncluded: true,
            keyValues: [
              {
                id: 'EXR_TYPE',
                values: ['NRP0', 'ERU1', 'ERC0', 'SP00'],
              },
              {
                id: 'EXR_SUFFIX',
                values: ['P', 'A', 'R', 'S', 'T', 'E'],
              },
              {
                id: 'FREQ',
                values: ['A', 'Q', 'M'],
              },
              {
                id: 'CURRENCY',
                values: ['_T', 'EUR', 'USD'],
              },
              {
                id: 'CURRENCY_DENOM',
                values: ['_T', 'EUR', 'USD'],
              },
            ],
          },
        ],
      },
    ],
  },
};

export const mocks25 = {
  meta: {
    schema:
      'https://raw.githubusercontent.com/sdmx-twg/sdmx-json/develop/structure-message/tools/schemas/1.0/sdmx-json-structure-schema.json',
    'content-languages': ['en'],
    id: 'IDREF19',
    prepared: '2018-12-07T13:46:02.0588291Z',
    test: false,
  },
  data: {
    dataflows: [
      {
        id: 'TEST_ANN',
        urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=OECD:TEST_ANN(1.0)',
        links: [
          {
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dataflow=OECD:TEST_ANN(1.0)',
            type: 'dataflow',
          },
          {
            rel: 'structure',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=OECD:DSD_ANN_TEST(1.0)',
            type: 'datastructure',
          },
        ],
        version: '1.0',
        agencyID: 'OECD',
        isFinal: false,
        name: {
          en: 'Test of annotations | Mike test 3',
        },
        annotations: [
          {
            type: 'NonProductionDataflow',
            text: {
              en: 'true',
            },
          },
        ],
        structure:
          'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=OECD:DSD_ANN_TEST(1.0)',
      },
    ],
    conceptSchemes: [
      {
        id: 'CS_ANN',
        urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=OECD:CS_ANN(1.0)',
        links: [
          {
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.ConceptScheme=OECD:CS_ANN(1.0)',
            type: 'conceptscheme',
          },
        ],
        version: '1.0',
        agencyID: 'OECD',
        isFinal: true,
        name: {
          en: 'Concept scheme to test annotations',
        },
        isPartial: true,
        concepts: [
          {
            id: 'DIMENSION_ROW',
            name: {
              en: 'Dimension to be shown in row section',
            },
            annotations: [
              {
                id: 'DIM_ANN',
                type: 'FULL_NAME',
                text: {
                  en: 'Dimension to be shown in row section - full description',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_ROW',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DIMENSION_COLUMN',
            name: {
              en: 'Dimension to be shown in columns',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_COLUMN',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DIMENSION_SECTION',
            name: {
              en: 'Dimension to be shown in section',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_SECTION',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DIMENSION_HIDDEN',
            name: {
              en: 'Hidden dimension',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_HIDDEN',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DIMENSION_COLUMN2',
            name: {
              en: 'Dimension to be shown in column 2',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_COLUMN2',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DIMENSION_SECTION2',
            name: {
              en: 'Dimension to be shown in section 2',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_SECTION2',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DIMENSION_SECTION3',
            name: {
              en: 'Dimension to be shown in section 3',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_SECTION3',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DIMENSION_HIDDEN2',
            name: {
              en: 'Hidden dimension 2',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_HIDDEN2',
                type: 'concept',
              },
            ],
          },
          {
            id: 'TIME_PERIOD',
            name: {
              en: 'Time period',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).TIME_PERIOD',
                type: 'concept',
              },
            ],
          },
          {
            id: 'OBS_VALUE',
            name: {
              en: 'Observation value',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).OBS_VALUE',
                type: 'concept',
              },
            ],
          },
          {
            id: 'OBS_STATUS',
            name: {
              en: 'Observation status',
            },
            annotations: [
              {
                id: 'ATTR_ANN',
                type: 'FULL_NAME',
                text: {
                  en: 'Observation status full description',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).OBS_STATUS',
                type: 'concept',
              },
            ],
          },
          {
            id: 'DECIMALS',
            name: {
              en: 'Decimals',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DECIMALS',
                type: 'concept',
              },
            ],
          },
          {
            id: 'PREF_SCALE',
            name: {
              en: 'Preferred scale',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).PREF_SCALE',
                type: 'concept',
              },
            ],
          },
        ],
      },
    ],
    codelists: [
      {
        id: 'CL_SEX',
        urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_SEX(1.0)',
        links: [
          {
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_SEX(1.0)',
            type: 'codelist',
          },
        ],
        version: '1.0',
        agencyID: 'MA_545',
        isFinal: true,
        name: {
          en: 'Sex',
        },
        isPartial: false,
        codes: [
          {
            id: 'F',
            name: {
              en: 'Female',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=MA_545:CL_SEX(1.0).F',
                type: 'code',
              },
            ],
          },
          {
            id: 'M',
            name: {
              en: 'Male',
            },
            annotations: [
              {
                type: 'DEFAULT',
              },
              {
                type: 'ORDER',
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=MA_545:CL_SEX(1.0).M',
                type: 'code',
              },
            ],
          },
          {
            id: '_T',
            name: {
              en: 'Total',
            },
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=MA_545:CL_SEX(1.0)._T',
                type: 'code',
              },
            ],
          },
        ],
      },
      {
        id: 'CL_ORDERED_LIST',
        urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=OECD:CL_ORDERED_LIST(1.0)',
        links: [
          {
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=OECD:CL_ORDERED_LIST(1.0)',
            type: 'codelist',
          },
        ],
        version: '1.0',
        agencyID: 'OECD',
        isFinal: true,
        name: {
          en: 'Codelist with annotations to define explicit order',
        },
        isPartial: false,
        codes: [
          {
            id: 'AAA',
            name: {
              en: 'Aaa',
            },
            annotations: [
              {
                id: 'AN_AAA',
                type: 'ORDER',
                text: {
                  en: '5',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).AAA',
                type: 'code',
              },
            ],
          },
          {
            id: 'BBB',
            name: {
              en: 'Bbb',
            },
            annotations: [
              {
                id: 'ANN_B',
                type: 'ORDER',
                text: {
                  en: '4',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).BBB',
                type: 'code',
              },
            ],
          },
          {
            id: 'CCC',
            name: {
              en: 'Ccc',
            },
            annotations: [
              {
                id: 'ANN_C',
                type: 'ORDER',
                text: {
                  en: '3',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).CCC',
                type: 'code',
              },
            ],
          },
          {
            id: 'DDD',
            name: {
              en: 'Ddd',
            },
            annotations: [
              {
                id: 'ANN_D',
                type: 'ORDER',
                text: {
                  en: '3',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).DDD',
                type: 'code',
              },
            ],
          },
          {
            id: 'EEE',
            name: {
              en: 'Eee',
            },
            annotations: [
              {
                id: 'ANN_E',
                type: 'ORDER',
                text: {
                  en: '2',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).EEE',
                type: 'code',
              },
            ],
          },
          {
            id: 'FFF',
            name: {
              en: 'Fff',
            },
            annotations: [
              {
                id: 'ANN_F',
                type: 'ORDER',
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).FFF',
                type: 'code',
              },
            ],
          },
          {
            id: 'GGG',
            name: {
              en: 'Ggg',
            },
            annotations: [
              {
                id: 'ANN_G',
                type: 'ORDER',
                text: {
                  en: '1',
                },
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).GGG',
                type: 'code',
              },
            ],
          },
          {
            id: 'HHH',
            name: {
              en: 'Hhh',
            },
            annotations: [
              {
                id: 'ANN_H',
                type: 'ORDER',
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).HHH',
                type: 'code',
              },
            ],
          },
          {
            id: 'III',
            name: {
              en: 'Iii',
            },
            annotations: [
              {
                id: 'ANN_I',
                type: 'ORDER',
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).III',
                type: 'code',
              },
            ],
          },
          {
            id: 'JJJ',
            name: {
              en: 'Jjj',
            },
            annotations: [
              {
                id: 'ANN_J',
                type: 'ORDER',
              },
            ],
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.codelist.Code=OECD:CL_ORDERED_LIST(1.0).JJJ',
                type: 'code',
              },
            ],
          },
        ],
      },
    ],
    dataStructures: [
      {
        id: 'DSD_ANN_TEST',
        urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=OECD:DSD_ANN_TEST(1.0)',
        links: [
          {
            rel: 'self',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataStructure=OECD:DSD_ANN_TEST(1.0)',
            type: 'datastructure',
          },
        ],
        version: '1.0',
        agencyID: 'OECD',
        isFinal: true,
        name: {
          en: 'DSD for tests of annotations',
        },
        dataStructureComponents: {
          attributeList: {
            id: 'AttributeDescriptor',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.AttributeDescriptor=OECD:DSD_ANN_TEST(1.0).AttributeDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.AttributeDescriptor=OECD:DSD_ANN_TEST(1.0).AttributeDescriptor',
                type: 'attributedescriptor',
              },
            ],
            attributes: [
              {
                id: 'OBS_STATUS',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=OECD:DSD_ANN_TEST(1.0).OBS_STATUS',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=OECD:DSD_ANN_TEST(1.0).OBS_STATUS',
                    type: 'dataattribute',
                  },
                ],
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).OBS_STATUS',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=KH_NIS:CL_OBS_STATUS(1.0)',
                },
                assignmentStatus: 'Conditional',
                attributeRelationship: {
                  primaryMeasure: 'OBS_VALUE',
                },
              },
              {
                id: 'DECIMALS',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=OECD:DSD_ANN_TEST(1.0).DECIMALS',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=OECD:DSD_ANN_TEST(1.0).DECIMALS',
                    type: 'dataattribute',
                  },
                ],
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DECIMALS',
                localRepresentation: {
                  textFormat: {
                    textType: 'String',
                    isSequence: false,
                    isMultiLingual: false,
                  },
                },
                assignmentStatus: 'Conditional',
                attributeRelationship: {
                  primaryMeasure: 'OBS_VALUE',
                },
              },
              {
                id: 'PREF_SCALE',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=OECD:DSD_ANN_TEST(1.0).PREF_SCALE',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DataAttribute=OECD:DSD_ANN_TEST(1.0).PREF_SCALE',
                    type: 'dataattribute',
                  },
                ],
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).PREF_SCALE',
                localRepresentation: {
                  textFormat: {
                    textType: 'String',
                    isSequence: false,
                    isMultiLingual: false,
                  },
                },
                assignmentStatus: 'Conditional',
                attributeRelationship: {
                  primaryMeasure: 'OBS_VALUE',
                },
              },
            ],
          },
          dimensionList: {
            id: 'DimensionDescriptor',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DimensionDescriptor=OECD:DSD_ANN_TEST(1.0).DimensionDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.DimensionDescriptor=OECD:DSD_ANN_TEST(1.0).DimensionDescriptor',
                type: 'dimensiondescriptor',
              },
            ],
            dimensions: [
              {
                id: 'DIMENSION_ROW',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_ROW',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_ROW',
                    type: 'dimension',
                  },
                ],
                position: 0,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_ROW',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=OECD:CL_ORDERED_LIST(1.0)',
                },
              },
              {
                id: 'DIMENSION_COLUMN',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_COLUMN',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_COLUMN',
                    type: 'dimension',
                  },
                ],
                position: 1,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_COLUMN',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_EDU_LEVEL(1.0)',
                },
              },
              {
                id: 'DIMENSION_SECTION',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_SECTION',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_SECTION',
                    type: 'dimension',
                  },
                ],
                position: 2,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_SECTION',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_SEX(1.0)',
                },
              },
              {
                id: 'DIMENSION_HIDDEN',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_HIDDEN',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_HIDDEN',
                    type: 'dimension',
                  },
                ],
                position: 3,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_HIDDEN',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_RELIGION(1.0)',
                },
              },
              {
                id: 'DIMENSION_COLUMN2',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_COLUMN2',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_COLUMN2',
                    type: 'dimension',
                  },
                ],
                position: 4,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_COLUMN2',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_GRADE(1.0)',
                },
              },
              {
                id: 'DIMENSION_SECTION2',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_SECTION2',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_SECTION2',
                    type: 'dimension',
                  },
                ],
                position: 5,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_SECTION2',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=KH_NIS:CL_MOTHER_TONGUE(1.0)',
                },
              },
              {
                id: 'DIMENSION_SECTION3',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_SECTION3',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_SECTION3',
                    type: 'dimension',
                  },
                ],
                position: 6,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_SECTION3',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_PROVINCES(1.0)',
                },
              },
              {
                id: 'DIMENSION_HIDDEN2',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_HIDDEN2',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.Dimension=OECD:DSD_ANN_TEST(1.0).DIMENSION_HIDDEN2',
                    type: 'dimension',
                  },
                ],
                position: 7,
                type: 'Dimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).DIMENSION_HIDDEN2',
                localRepresentation: {
                  enumeration:
                    'urn:sdmx:org.sdmx.infomodel.codelist.Codelist=MA_545:CL_SECTOR_GDP(1.0)',
                },
              },
            ],
            timeDimensions: [
              {
                id: 'TIME_PERIOD',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.TimeDimension=OECD:DSD_ANN_TEST(1.0).TIME_PERIOD',
                links: [
                  {
                    rel: 'self',
                    urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.TimeDimension=OECD:DSD_ANN_TEST(1.0).TIME_PERIOD',
                    type: 'timedimension',
                  },
                ],
                position: 8,
                type: 'TimeDimension',
                conceptIdentity:
                  'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).TIME_PERIOD',
                localRepresentation: {
                  textFormat: {
                    textType: 'ObservationalTimePeriod',
                    isSequence: false,
                    isMultiLingual: false,
                  },
                },
              },
            ],
          },
          measureList: {
            id: 'MeasureDescriptor',
            urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.MeasureDescriptor=OECD:DSD_ANN_TEST(1.0).MeasureDescriptor',
            links: [
              {
                rel: 'self',
                urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.MeasureDescriptor=OECD:DSD_ANN_TEST(1.0).MeasureDescriptor',
                type: 'measuredescriptor',
              },
            ],
            primaryMeasure: {
              id: 'OBS_VALUE',
              urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.PrimaryMeasure=OECD:DSD_ANN_TEST(1.0).OBS_VALUE',
              links: [
                {
                  rel: 'self',
                  urn: 'urn:sdmx:org.sdmx.infomodel.datastructure.PrimaryMeasure=OECD:DSD_ANN_TEST(1.0).OBS_VALUE',
                  type: 'primarymeasure',
                },
              ],
              conceptIdentity:
                'urn:sdmx:org.sdmx.infomodel.conceptscheme.Concept=OECD:CS_ANN(1.0).OBS_VALUE',
            },
          },
        },
      },
    ],
  },
};
