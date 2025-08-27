/**
 * Component mapping from dotstatsuite-visions to AntD
 */

export const COMPONENT_MAP = {
  // Basic Components
  'Button': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Button',
    propsMap: {
      'variant': 'type',
      'color': 'type',
      'fullWidth': (value: boolean) => ({ style: { width: value ? '100%' : 'auto' } })
    }
  },
  'Input': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Input',
    propsMap: {
      'fullWidth': (value: boolean) => ({ style: { width: value ? '100%' : 'auto' } }),
      'error': 'status',
      'helperText': 'placeholder'
    }
  },
  'Select': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Select',
    propsMap: {
      'fullWidth': (value: boolean) => ({ style: { width: value ? '100%' : 'auto' } })
    }
  },
  'Loading': {
    from: '@sis-cc/dotstatsuite-visions',
    to: '@/lib/dotstatsuite-antd/components/basic',
    component: 'Loading',
    propsMap: {}
  },
  'NoData': {
    from: '@sis-cc/dotstatsuite-visions',
    to: '@/lib/dotstatsuite-antd/components/basic',
    component: 'NoData',
    propsMap: {}
  },
  'Tooltip': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Tooltip',
    propsMap: {}
  },
  'Tag': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Tag',
    propsMap: {}
  },
  'Alert': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Alert',
    propsMap: {
      'severity': 'type'
    }
  },
  
  // Complex Components
  'ExpansionPanel': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Collapse',
    propsMap: {
      'expanded': 'activeKey',
      'onChange': 'onChange'
    }
  },
  'DynamicDrawer': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Drawer',
    propsMap: {
      'open': 'open',
      'onClose': 'onClose',
      'anchor': 'placement'
    }
  },
  'Pagination': {
    from: '@sis-cc/dotstatsuite-visions',
    to: 'antd',
    component: 'Pagination',
    propsMap: {
      'count': 'total',
      'page': 'current',
      'rowsPerPage': 'pageSize'
    }
  },
  
  // Table Components
  'TableHtml5': {
    from: '@sis-cc/dotstatsuite-visions',
    to: '@/lib/dotstatsuite-antd/components/table',
    component: 'SDMXTableAutoFreeze',
    propsMap: {},
    needsCustomImplementation: true
  },
  'TableLayout': {
    from: '@sis-cc/dotstatsuite-visions',
    to: '@/lib/dotstatsuite-antd/components/layout',
    component: 'LayoutPanel', // TableLayoutConfig replaced by LayoutPanel
    propsMap: {},
    needsCustomImplementation: true
  }
};

// Function to get AntD equivalent
export function getAntDComponent(visionsComponent: string) {
  return COMPONENT_MAP[visionsComponent as keyof typeof COMPONENT_MAP] || null;
}

// Function to transform props
export function transformProps(component: string, props: any) {
  const mapping = COMPONENT_MAP[component as keyof typeof COMPONENT_MAP];
  if (!mapping || !mapping.propsMap) return props;
  
  const transformed = { ...props };
  
  Object.entries(mapping.propsMap).forEach(([oldProp, newProp]) => {
    if (props[oldProp] !== undefined) {
      if (typeof newProp === 'function') {
        Object.assign(transformed, newProp(props[oldProp]));
        delete transformed[oldProp];
      } else {
        transformed[newProp as string] = props[oldProp];
        delete transformed[oldProp];
      }
    }
  });
  
  return transformed;
}
