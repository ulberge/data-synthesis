import React, { useState } from 'react';
import Assets from './Assets';

/**
 * Component that renders and manages the UI workflow for data synthesis.
 */
function Synthesis() {
  const [ selectedAsset, setSelectedAsset ] = useState<File | undefined>();

  return (
    <div>
      <Assets selectedAsset={selectedAsset} setSelectedAsset={setSelectedAsset} />
    </div>
  );
}

export default Synthesis;
