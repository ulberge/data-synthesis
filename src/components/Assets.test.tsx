import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import Assets from './Assets';

const nonImageFile = new File(['test'], 'test.txt', { type: 'text/html' });
const imageFile = new File(['(⌐□_□)'], 'image.png', { type: 'image/png' });
const imageFile2 = new File(['(⌐□_□)'], 'image2.png', { type: 'image/png' });

global.URL.createObjectURL = jest.fn();

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

test('renders Assets component with no assets', () => {
  const { container } = render(
    <Assets
      assets={[] as File[]}
      setAssets={(assets: File[]) => null}
      setSelectedAsset={(asset: File) => null}
    />
  );
  expect(container).toMatchSnapshot();
});

test('renders Assets component with assetsFiles', () => {
  const { container } = render(
    <Assets
      assets={[imageFile]}
      setAssets={(assets: File[]) => null}
      setSelectedAsset={(asset: File) => null}
    />
  );
  expect(container.querySelectorAll('img').length).toBe(1);
  expect(container).toMatchSnapshot();
});

test('onDrop no files setAssets not called, setSelectedAsset not called', async () => {
  const data = mockData([]);
  const setAssets = jest.fn((assets: File[]) => null);
  const setSelectedAsset = jest.fn((asset: File) => null);
  const ui = (
    <Assets
      assets={[]}
      setAssets={setAssets}
      setSelectedAsset={setSelectedAsset}
    />
  );
  const { container } = render(ui);
  // Drop a file
  await act(async () => {
    const dropzone = container.querySelector('div');
    dispatchEvt(dropzone, 'drop', data);
    await flushPromises(ui, container);
  });

  expect(setAssets).toHaveBeenCalledTimes(0);
  expect(setSelectedAsset).toHaveBeenCalledTimes(0);
});

test('onDrop mix of files setAssets called with images, setSelectedAsset called with first image file', async () => {
  const data = mockData([nonImageFile, imageFile]);
  const setAssets = jest.fn((assets: File[]) => null);
  const setSelectedAsset = jest.fn((asset: File) => null);
  const ui = (
    <Assets
      assets={[]}
      setAssets={setAssets}
      setSelectedAsset={setSelectedAsset}
    />
  );
  const { container } = render(ui);
  expect(setAssets).toHaveBeenCalledTimes(0);
  expect(setSelectedAsset).toHaveBeenCalledTimes(0);
  // Drop a file
  await act(async () => {
    const dropzone = container.querySelector('div');
    dispatchEvt(dropzone, 'drop', data);
    await flushPromises(ui, container);
  });

  expect(setAssets).toHaveBeenCalledTimes(1);
  expect(setAssets).toHaveBeenCalledWith([imageFile]);
  expect(setSelectedAsset).toHaveBeenCalledTimes(1);
  expect(setSelectedAsset).toHaveBeenCalledWith(imageFile);
});

test('onDrop only non-image files setAssets not called, setSelectedAsset not called', async () => {
  const data = mockData([nonImageFile]);
  const setAssets = jest.fn((assets: File[]) => null);
  const setSelectedAsset = jest.fn((asset: File) => null);
  const ui = (
    <Assets
      assets={[]}
      setAssets={setAssets}
      setSelectedAsset={setSelectedAsset}
    />
  );
  const { container } = render(ui);
  // Drop a file
  await act(async () => {
    const dropzone = container.querySelector('div');
    dispatchEvt(dropzone, 'drop', data);
    await flushPromises(ui, container);
  });

  expect(setAssets).toHaveBeenCalledTimes(0);
  expect(setSelectedAsset).toHaveBeenCalledTimes(0);
});

test('onDrop with existing assets causes setAssets called with all images, setSelectedAsset called with second image', async () => {
  const data = mockData([imageFile2]);
  const setAssets = jest.fn((assets: File[]) => null);
  const setSelectedAsset = jest.fn((asset: File) => null);
  const ui = (
    <Assets
      assets={[imageFile]}
      setAssets={setAssets}
      setSelectedAsset={setSelectedAsset}
    />
  );
  const { container } = render(ui);
  expect(setAssets).toHaveBeenCalledTimes(0);
  expect(setSelectedAsset).toHaveBeenCalledTimes(0);
  // Drop a file
  await act(async () => {
    const dropzone = container.querySelector('div');
    dispatchEvt(dropzone, 'drop', data);
    await flushPromises(ui, container);
  });

  expect(setAssets).toHaveBeenCalledTimes(1);
  expect(setAssets).toHaveBeenCalledWith(expect.arrayContaining([imageFile, imageFile2]));
  expect(setSelectedAsset).toHaveBeenCalledTimes(1);
  expect(setSelectedAsset).toHaveBeenCalledWith(imageFile2);
});

// onClick of image setSelectedAsset called
test('onClick of image causes setSelectedAsset called with that image', () => {
  const setSelectedAsset = jest.fn((asset: File) => null);

  const { container } = render(
    <Assets
      assets={[imageFile, imageFile2]}
      setAssets={(assets: File[]) => null}
      setSelectedAsset={setSelectedAsset}
    />
  );
  // Check there are two items shown
  expect(container.querySelectorAll('button').length).toBe(2);
  // Click on the second
  fireEvent.click(container.querySelectorAll('button')[1]);
  // setSelectedAsset should be called with the second
  expect(setSelectedAsset).toHaveBeenCalledTimes(1);
  expect(setSelectedAsset).toHaveBeenCalledWith(imageFile2);
});

