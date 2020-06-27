import React, { useCallback, useState } from 'react';
import cx from 'classnames';
import { useDropzone } from 'react-dropzone';
import styles from './Assets.module.css';

interface AssetsProps {
  assets: File[],
  setAssets: (assets: File[]) => void,
  selectedAsset?: File,
  setSelectedAsset: (asset?: File) => void,
}

/**
 * Component that accepts drag and drop files and renders them as selectable thumbnails.
 */
function Assets(props: Readonly<AssetsProps>) {
  const { assets, setAssets, selectedAsset, setSelectedAsset } = props;

  const onDrop = useCallback((files: File[]) => {
    // Filter files to only images
    const acceptedFiles = files.filter((file: File) => file.type.match(/image.*/));
    // Select the first new asset
    if (acceptedFiles.length > 0) {
      // Append new files to assets
      const newAssets = [ ...assets, ...acceptedFiles ];
      setAssets(newAssets);
      setSelectedAsset(acceptedFiles[0]);
    }
  }, [assets, setAssets]);

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
              assets.map((asset: File, i: number) => (
                <li
                  key={asset.name + '_' + i}
                  className={asset === selectedAsset ? styles.selected : ''}
                >
                  <button onClick={() => setSelectedAsset(asset)}>
                    <img src={URL.createObjectURL(asset)} alt={asset.name} />
                  </button>
                </li>
              ))
            }
          </ul>)
      }
    </div>
  );
}

export default Assets;
