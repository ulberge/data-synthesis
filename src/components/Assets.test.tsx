import React from 'react';
import { render, act, fireEvent } from '../test-utils';
import ConnectedAssets, { Assets } from './Assets';
import * as imageUtils from '../image-utils';

const nonImageFile = new File(['test'], 'test.txt', { type: 'text/html' });
const imageFile = new File(['(⌐□_□)'], 'image.png', { type: 'image/png' });
const imageFile2 = new File(['(⌐□_□)'], 'image2.png', { type: 'image/png' });

global.URL.createObjectURL = jest.fn();
imageUtils.getDataURLs = jest.fn((files: File[]) => files.map(file => file.name));

function flushPromises(ui, container) {
  return new Promise(resolve =>
    setImmediate(() => {
      render(ui, { container })
      resolve(container)
    })
  )
}

function dispatchEvt(node, type, data) {
  const event = new Event(type, { bubbles: true })
  Object.assign(event, data)
  fireEvent(node, event)
}

function mockData(files) {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  }
}

describe('Assets', () => {
  it('should render component with no assets', () => {
    const { container } = render(
      <Assets
        assets={[] as File[]}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it('should render with assets in props', () => {
    const { container } = render(
      <Assets
        assets={[imageFile]}
      />
    );
    expect(container.querySelectorAll('img').length).toBe(1);
    expect(container).toMatchSnapshot();
  });
});

describe('ConnectedAssets', () => {
  it('should not call addAssets onDrop no files', async () => {
    const data = mockData([]);
    const addAssets = jest.fn((dataURLs: string[]) => null);
    const ui = (
      <Assets
        assets={[]}
        addAssets={addAssets}
      />
    );
    const { container } = render(ui);
    // Drop a file
    await act(async () => {
      const dropzone = container.querySelector('div');
      dispatchEvt(dropzone, 'drop', data);
      await flushPromises(ui, container);
    });

    expect(addAssets).toHaveBeenCalledTimes(0);
  });

  test('should call addAssets with images onDrop of mix of files', async () => {
    const data = mockData([nonImageFile, imageFile]);
    const addAssets = jest.fn((dataURLs: string[]) => null);
    const ui = (
      <Assets
        assets={[]}
        addAssets={addAssets}
      />
    );
    const { container } = render(ui);
    expect(addAssets).toHaveBeenCalledTimes(0);
    // Drop a file
    await act(async () => {
      const dropzone = container.querySelector('div');
      dispatchEvt(dropzone, 'drop', data);
      await flushPromises(ui, container);
    });

    expect(addAssets).toHaveBeenCalledTimes(1);
    expect(addAssets).toHaveBeenCalledWith([imageFile.name]);
  });

  it('should not call addAssets onDrop of only non-image files', async () => {
    const data = mockData([nonImageFile]);
    const addAssets = jest.fn((dataURLs: string[]) => null);
    const ui = (
      <Assets
        assets={[]}
        addAssets={addAssets}
      />
    );
    const { container } = render(ui);
    // Drop a file
    await act(async () => {
      const dropzone = container.querySelector('div');
      dispatchEvt(dropzone, 'drop', data);
      await flushPromises(ui, container);
    });

    expect(addAssets).toHaveBeenCalledTimes(0);
  });

  it('should call setSelectedAsset onClick of image', () => {
    const setSelectedAsset = jest.fn((asset: File) => null);

    const { container } = render(
      <Assets
        assets={[imageFile, imageFile2]}
        setSelectedAsset={setSelectedAsset}
      />
    );
    // Check there are two items shown
    expect(container.querySelectorAll('li button').length).toBe(2);
    // Click on the second
    fireEvent.click(container.querySelectorAll('li button')[1]);
    // setSelectedAsset should be called with the second
    expect(setSelectedAsset).toHaveBeenCalledTimes(1);
    expect(setSelectedAsset).toHaveBeenCalledWith(imageFile2);
  });
});

