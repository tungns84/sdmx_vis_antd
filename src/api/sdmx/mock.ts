import sample from '../../../sampleData.json';

export type SdmxSample = typeof sample;

export const fetchSdmxSample = async (): Promise<SdmxSample> => {
  return new Promise((resolve) => {
    // simulate network latency
    setTimeout(() => resolve(sample as SdmxSample), 300);
  });
};


