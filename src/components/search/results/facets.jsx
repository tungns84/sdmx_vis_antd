import React from 'react';
import * as R from 'ramda';
import { HierarchicalFilter } from '@sis-cc/dotstatsuite-visions';
import { useIntl } from 'react-intl';
import { tagAccessor } from '../../vis-side/utils';
import messages from '../../messages';
import {
  displayChildren,
  setOfHideHomeAndResultFacetItemIDs,
} from '../../../lib/settings';
import { formatMessage } from '../../../i18n';
import { getAccessor, setLabel } from '../utils';

const Facets = ({ facets = [], ...parentProps }) => {
  const intl = useIntl();

  return R.map(
    ({ id, label, values, isPinned }) => (
      <HierarchicalFilter
        {...parentProps}
        id={id}
        key={id}
        label={R.prop('label', setLabel({ intl })({ label, id }))}
        expansionPanelProps={{
          isPinned,
          pinnedLabel: formatMessage(intl)(messages.pinned),
        }}
        items={values}
        hasPath={false}
        displayAccessor={R.pipe(R.prop('isDisabled'), R.not)}
        disableAccessor={R.prop('isDisabled')}
        tagAccessor={tagAccessor}
        tagAriaLabel={(count, total) =>
          formatMessage(intl)(messages.tagLabel, { count, total })
        }
        labelRenderer={(props) =>
          getAccessor(setOfHideHomeAndResultFacetItemIDs.has(id))(props)
        }
        labels={{
          disableItemLabel: formatMessage(intl)(messages.disableItemLabel),
          placeholder: (total) =>
            formatMessage(intl)(messages.primary, { total }),
          iconLabel: formatMessage(intl)(messages.advancedFilter),
          navigateNext: formatMessage(intl)(messages.next),
        }}
        simpleSelectionMode={true}
        displayChildren={displayChildren}
      />
    ),
    facets,
  );
};

export default Facets;
