import React, { useCallback } from 'react';
import cx from 'classnames';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';

import { Asset } from 'MyModels';
import { RootState } from '../store/root-reducer';
import { getAssets } from '../store/assets/selectors';
import { addAssets } from '../store/assets/actions';

import styles from './Assets.module.css';

// function getAssets() {
//   return [] as
// }

const mapStateToProps = (state: RootState) => ({
  assets: getAssets(state.assets) as Asset[],
});
const dispatchProps = {
  addAssets,
};

interface AssetsProps {
  assets: Asset[],
  // assets: 'unknown',
  addAssets: (assets: File[]) => void,
  selectedAsset?: File,
  setSelectedAsset: (asset?: File) => void,
}

/**
 * Component that accepts drag and drop files and renders them as selectable thumbnails.
 */
function Assets(props: Readonly<AssetsProps>) {
  const { assets, addAssets, selectedAsset, setSelectedAsset } = props;

  const onDrop = useCallback((files: File[]) => {
    // Filter files to only images
    const acceptedFiles = files.filter((file: File) => file.type.match(/image.*/));
    // Select the first new asset
    if (acceptedFiles.length > 0) {
      // Append new files to assets
      // const newAssets = [ ...assets, ...acceptedFiles ];
      addAssets(acceptedFiles);
      setSelectedAsset(acceptedFiles[0]);
    }
  }, [addAssets, setSelectedAsset]);

  const {getRootProps, isDragActive} = useDropzone({onDrop});

  return (
    <div
      className={cx(
        styles.dragdrop,
        {
          [styles.dragged]: isDragActive, // Highlight on active drag
        },
      )}
      {...getRootProps()}
    >
      {
        assets.length === 0 ?
          <p className={styles.center}>{ isDragActive ? 'Drop assets here...' : 'Drop assets here' }</p> :
          (<ul className={styles.thumbnails}>
            {
              assets.map((asset: Asset) => (
                <li
                  key={asset.id}
                  className={asset.file === selectedAsset ? styles.selected : ''}
                >
                  <button onClick={() => setSelectedAsset(asset.file)}>
                    <img src={URL.createObjectURL(asset.file)} alt={asset.file.name} />
                  </button>
                </li>
              ))
            }
          </ul>)
      }
    </div>
  );
}

// export default Assets;
export default connect(
  mapStateToProps,
  dispatchProps
)(Assets);
