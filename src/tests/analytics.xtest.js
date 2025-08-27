import { formatConstraints } from '../middlewares/analytics';

describe('Analytics utils tests', () => {
  const pushHistory = {
    //2 constraints
    payload: {
      constraints: {
        browse1: {
          facetId: 'FakeTopic',
          constraintId: '8|Biology#BIO#',
        },
        browse2: {
          facetId: 'FakeTopic',
          constraintId: '9|Biology#BIO#|Physics#PHY#',
        },
      },
    },
  };
  const result = {
    browse_by_value:
      'FakeTopic=8|Biology#BIO# > FakeTopic=9|Biology#BIO#|Physics#PHY#',
  };
  it('formatConstraints test', () => {
    expect(formatConstraints(pushHistory)).toEqual(result.browse_by_value);
  });
});
