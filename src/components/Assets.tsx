import React, { useCallback } from 'react';
import cx from 'classnames';
import { useDropzone } from 'react-dropzone';
import { connect } from 'react-redux';

import { Asset } from 'Models';
import { RootState, getAssets, addAssets, removeAssets } from '../store';

import { getDataURLs } from '../image-utils';

import styles from './Assets.module.css';

const mapStateToProps = (state: RootState) => ({
  assets: getAssets(state.assets) as Asset[],
});
const dispatchProps = {
  addAssets,
  removeAssets
};

interface AssetsProps {
  assets: Asset[],
  addAssets: (dataURLs: string[]) => void,
  removeAssets: () => void,
  selectedAsset: Asset | undefined,
  setSelectedAsset: (asset?: Asset) => void,
}

/**
 * Component that accepts drag and drop files and renders them as selectable thumbnails.
 */
export function Assets(props: Readonly<AssetsProps>) {
  const { assets, addAssets, removeAssets, selectedAsset, setSelectedAsset } = props;

  const onDrop = useCallback(async (files: File[]) => {
    // Filter files to only images
    const acceptedFiles = files.filter((file: File) => file.type.match(/image.*/));
    // Select the first new asset
    if (acceptedFiles.length > 0) {
      // Convert image files to dataURLs
      const dataURLs = await getDataURLs(acceptedFiles) as string[];
      addAssets(dataURLs);
    }
  }, [addAssets]);

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
          (
            <>
              <button onClick={removeAssets} className={styles.clear}>Clear</button>
              <ul className={styles.thumbnails}>
                {
                  assets.map((asset: Asset) => (
                    <li
                      key={asset.id}
                      className={selectedAsset && asset.id === selectedAsset.id ? styles.selected : ''}
                    >
                      <button onClick={() => setSelectedAsset(asset)}>
                        <img src={asset.dataURL} alt={asset.id} />
                      </button>
                    </li>
                  ))
                }
              </ul>
            </>
          )

      }
    </div>
  );
}

export default connect(
  mapStateToProps,
  dispatchProps
)(Assets);
