import React, { ReactElement, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/reducers';
import { setLayerStyleFillThunk, setLayerStyleStrokeThunk, setLayerStyleShadowThunk, setLayerTransformFlipHorizontallyThunk, setLayerTransformFlipVerticallyThunk, setLayerCombineUnionThunk,  setLayerCombineSubtractThunk, setLayerCombineIntersectThunk, setLayerCombineDifferenceThunk, setLayerImageOriginalDimensionsThunk, setLayerImageReplaceThunk, setLayerMaskUseAsMaskThunk, setLayerMaskIgnoreUnderlyingMaskThunk } from '../store/actions/keyBindings';
import PreferencesBindingInput from './PreferencesBindingInput';
import SidebarSectionHead from './SidebarSectionHead';
import ListGroup from './ListGroup';

const PreferencesBindingsLayer = (): ReactElement => {
  const styleFill = useSelector((state: RootState) => state.keyBindings.layer.style.fill);
  const styleStroke = useSelector((state: RootState) => state.keyBindings.layer.style.stroke);
  const styleShadow = useSelector((state: RootState) => state.keyBindings.layer.style.shadow);
  const transformFlipHorizontally = useSelector((state: RootState) => state.keyBindings.layer.transform.flipHorizontally);
  const transformFlipVertically = useSelector((state: RootState) => state.keyBindings.layer.transform.flipVertically);
  const combineUnion = useSelector((state: RootState) => state.keyBindings.layer.combine.union);
  const combineSubtract = useSelector((state: RootState) => state.keyBindings.layer.combine.subtract);
  const combineIntersect = useSelector((state: RootState) => state.keyBindings.layer.combine.intersect);
  const combineDifference = useSelector((state: RootState) => state.keyBindings.layer.combine.difference);
  const imageOriginalDimensions = useSelector((state: RootState) => state.keyBindings.layer.image.originalDimensions);
  const imageReplace = useSelector((state: RootState) => state.keyBindings.layer.image.replace);
  const maskUseAsMask = useSelector((state: RootState) => state.keyBindings.layer.mask.useAsMask);
  const maskIgnoreUnderlyingMask = useSelector((state: RootState) => state.keyBindings.layer.mask.ignoreUnderlyingMask);

  return (
    <div className='c-preferences__tab-section'>
      <div className='c-preferences__input-group'>
        <SidebarSectionHead
          text='Layer' />
        <ListGroup>
          <PreferencesBindingInput
            binding={styleFill}
            onChange={setLayerStyleFillThunk}
            title='Toggle Fill'
            icon='fill'
            storeKey='layer.style.fill' />
          <PreferencesBindingInput
            binding={styleStroke}
            onChange={setLayerStyleStrokeThunk}
            title='Toggle Stroke'
            icon='stroke'
            storeKey='layer.style.stroke' />
          <PreferencesBindingInput
            binding={styleShadow}
            onChange={setLayerStyleShadowThunk}
            title='Toggle Shadow'
            icon='shadow'
            storeKey='layer.style.shadow' />
          <PreferencesBindingInput
            binding={transformFlipHorizontally}
            onChange={setLayerTransformFlipHorizontallyThunk}
            title='Flip Horizontally'
            icon='flip-horizontally'
            storeKey='layer.transform.flipHorizontally' />
          <PreferencesBindingInput
            binding={transformFlipVertically}
            onChange={setLayerTransformFlipVerticallyThunk}
            title='Flip Vertically'
            icon='flip-vertically'
            storeKey='layer.transform.flipVertically' />
          <PreferencesBindingInput
            binding={combineUnion}
            onChange={setLayerCombineUnionThunk}
            title='Combine Union'
            icon='combine-union'
            storeKey='layer.combine.union' />
          <PreferencesBindingInput
            binding={combineSubtract}
            onChange={setLayerCombineSubtractThunk}
            title='Combine Subtract'
            icon='combine-subtract'
            storeKey='layer.combine.subtract' />
          <PreferencesBindingInput
            binding={combineIntersect}
            onChange={setLayerCombineIntersectThunk}
            title='Combine Intersect'
            icon='combine-intersect'
            storeKey='layer.combine.intersect' />
          <PreferencesBindingInput
            binding={combineDifference}
            onChange={setLayerCombineDifferenceThunk}
            title='Combine Difference'
            icon='combine-difference'
            storeKey='layer.combine.difference' />
          <PreferencesBindingInput
            binding={maskUseAsMask}
            onChange={setLayerMaskUseAsMaskThunk}
            title='Use As Mask'
            icon='mask'
            storeKey='layer.mask.useAsMask' />
          <PreferencesBindingInput
            binding={maskIgnoreUnderlyingMask}
            onChange={setLayerMaskIgnoreUnderlyingMaskThunk}
            title='Ignore Underlying Mask'
            icon='ignore-underlying-mask'
            storeKey='layer.mask.ignoreUnderlyingMask' />
        </ListGroup>
      </div>
    </div>
  );
};

export default PreferencesBindingsLayer;