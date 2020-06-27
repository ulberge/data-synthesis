import React, { useState, useCallback } from 'react';
import Assets from './Assets';

/**
 * Component that renders and manages the UI workflow for data synthesis.
 */
function Synthesis() {
  // List of image assets loaded through drag and drop area
  const [ assets, setAssets ] = useState<File[]>([]);
  const [ selectedAsset, setSelectedAsset ] = useState<File | undefined>();

  return (
    <div>
      <Assets assets={assets} setAssets={setAssets} selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} />
    </div>
  );
}

export default Synthesis;
