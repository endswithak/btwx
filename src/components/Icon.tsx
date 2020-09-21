import React, { ReactElement, useContext } from 'react';
import { connect } from 'react-redux';
import { paperMain } from '../canvas';
import { RootState } from '../store/reducers';
import { ThemeContext } from './ThemeProvider';

interface IconProps {
  name: string;
  style?: any;
  small?: boolean;
  shapeId?: string;
  pathData?: string;
}

const Icon = (props: IconProps): ReactElement => {
  const theme = useContext(ThemeContext);
  const { name, style, small, pathData } = props;
  const iconData = (() => {
    switch(name) {
      case 'edit':
        return {
          name: 'edit',
          fill: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z',
          opacity: null
        }
      case 'list-toggle':
        return {
          name: 'list-toggle',
          fill: 'M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z',
          opacity: null
        }
      case 'freeze':
        return {
          name: 'freeze',
          fill: 'M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z',
          opacity: null
        }
      case 'left-arrow':
        return {
          name: 'left-arrow',
          fill: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z',
          opacity: null
        }
      case 'shape':
        return {
          name: 'shape',
          fill: pathData,
          opacity: null
        }
      case 'artboard':
        return {
          name: 'artboard',
          fill: 'M12.4743416,2.84188612 L12.859,3.99988612 L21,4 L21,15 L22,15 L22,16 L16.859,15.9998861 L18.4743416,20.8418861 L17.5256584,21.1581139 L16.805,18.9998861 L7.193,18.9998861 L6.47434165,21.1581139 L5.52565835,20.8418861 L7.139,15.9998861 L2,16 L2,15 L3,15 L3,4 L11.139,3.99988612 L11.5256584,2.84188612 L12.4743416,2.84188612 Z M15.805,15.9998861 L8.193,15.9998861 L7.526,17.9998861 L16.472,17.9998861 L15.805,15.9998861 Z M20,5 L4,5 L4,15 L20,15 L20,5 Z',
          opacity: null
        }
      case 'rectangle':
        return {
          name: 'rectangle',
          fill: 'M4,4 L19.999,4 C19.9995523,4 20,4.00044772 20,4.001 L20,20 L20,20 L4,20 L4,4 Z',
          opacity: null
        }
      case 'rounded':
        return {
          name: 'rounded',
          fill: 'M7.55555556,4 L16.4444444,4 C18.4081236,4 20,5.59187645 20,7.55555556 L20,16.4444444 C20,18.4081236 18.4081236,20 16.4444444,20 L7.55555556,20 C5.59187645,20 4,18.4081236 4,16.4444444 L4,7.55555556 C4,5.59187645 5.59187645,4 7.55555556,4 Z',
          opacity: null
        }
      case 'ellipse':
        return {
          name: 'ellipse',
          fill: 'M12,4 C16.418278,4 20,7.581722 20,12 C20,16.418278 16.418278,20 12,20 C7.581722,20 4,16.418278 4,12 C4,7.581722 7.581722,4 12,4 Z',
          opacity: null
        }
      case 'star':
        return {
          name: 'star',
          fill: 'M12,17.9252329 L6.4376941,21 L7.5,14.4875388 L3,9.8753882 L9.21884705,8.92523292 L11.9990948,3.00192861 C11.9993294,3.00142866 11.9999249,3.0012136 12.0004249,3.00144827 C12.0006362,3.00154743 12.0008061,3.00171735 12.0009052,3.00192861 L14.7811529,8.92523292 L14.7811529,8.92523292 L21,9.8753882 L16.5,14.4875388 L17.5623059,21 L12,17.9252329 Z',
          opacity: null
        }
      case 'polygon':
        return {
          name: 'polygon',
          fill: 'M12.0006071,3.00046375 L20.9994457,9.87496475 C20.9997787,9.87521916 20.9999178,9.87565424 20.9997941,9.87605465 L17.5625237,20.9992952 C17.5623942,20.9997142 17.5620068,21 17.5615683,21 L6.43843174,21 C6.43799318,21 6.4376058,20.9997142 6.43747632,20.9992952 L3.00020594,9.87605465 C3.00008221,9.87565424 3.00022128,9.87521916 3.0005543,9.87496475 L11.9993929,3.00046375 C11.9997513,3.00018996 12.0002487,3.00018996 12.0006071,3.00046375 Z',
          opacity: null
        }
      case 'line':
        return {
          name: 'line',
          fill: 'M18.7928932,3.79289322 C19.1834175,3.40236893 19.8165825,3.40236893 20.2071068,3.79289322 C20.5675907,4.15337718 20.5953203,4.72060824 20.2902954,5.11289944 L20.2071068,5.20710678 L5.20710678,20.2071068 C4.81658249,20.5976311 4.18341751,20.5976311 3.79289322,20.2071068 C3.43240926,19.8466228 3.40467972,19.2793918 3.70970461,18.8871006 L3.79289322,18.7928932 L18.7928932,3.79289322 Z',
          opacity: null
        }
      case 'text':
        return {
          name: 'text',
          fill: 'M12.84,18.999 L12.84,6.56 L12.84,6.56 L16.92,6.56 L16.92,5 L7.08,5 L7.08,6.56 L11.16,6.56 L11.16,19 L12.839,19 C12.8395523,19 12.84,18.9995523 12.84,18.999 Z',
          opacity: null
        }
      case 'image':
        return {
          name: 'image',
          fill: theme.name === 'dark' ? 'M7,11 L15.182,20 L3,20 L3,15.4 L7,11 Z M16.6243657,6.71118154 C16.9538983,6.79336861 17.2674833,6.9606172 17.5297066,7.21384327 C18.3242674,7.98114172 18.3463679,9.24727881 17.5790695,10.0418396 C16.811771,10.8364004 15.5456339,10.8585009 14.7510731,10.0912025 C14.4888499,9.8379764 14.3107592,9.53041925 14.21741,9.2034121 C14.8874902,9.37067575 15.6260244,9.1851639 16.1403899,8.65252287 C16.6547553,8.11988184 16.8143797,7.37532327 16.6243657,6.71118154 Z' : 'M7,11 L15.182,20 L3,20 L3,15.4 L7,11 Z M16,7 C17.1045695,7 18,7.8954305 18,9 C18,10.1045695 17.1045695,11 16,11 C14.8954305,11 14,10.1045695 14,9 C14,7.8954305 14.8954305,7 16,7 Z',
          opacity: 'M21,4 L21,20 L3,20 L3,4 L21,4 Z M20,5 L4,5 L4,19 L10.344,19 L16,13.6703297 L20,17.44 L20,5 Z'
        }
      case 'subtract':
        return {
          name: 'subtract',
          fill: 'M7,9.001 L7,17 L7,17 L15,17 L15,21 L3.001,21 C3.00044772,21 3,20.9995523 3,20.999 L3,9 L3,9 L6.999,9 C6.99955228,9 7,9.00044772 7,9.001 Z',
          opacity: 'M9,3 L21,3.001 L21,15 L9.001,14.9990001 C9.00044775,14.999 9.00000008,14.9985523 9,14.998 L9,3 L9,3 Z'
        }
      case 'intersect':
        return {
          name: 'intersect',
          fill: 'M9,9 L15,9.001 L15,15 L9.001,14.9990002 C9.00044778,14.9989999 9.00000017,14.9985522 9,14.998 L9,9 L9,9 Z',
          opacity: 'M7,9 L7,17 L15,17 L15,21 L3.001,21 C3.00044772,21 3,20.9995523 3,20.999 L3,9 L3,9 L7,9 Z M21,3 L21,15 L17,15 L17,7 L9,7 L9,3 L21,3 Z'
        }
      case 'tweens':
        return {
          name: 'tweens',
          fill: 'M5.5,18 C6.32842712,18 7,18.6715729 7,19.5 C7,20.3284271 6.32842712,21 5.5,21 L3.5,21 C2.67157288,21 2,20.3284271 2,19.5 C2,18.6715729 2.67157288,18 3.5,18 L5.5,18 Z M20.5,11 C21.3284271,11 22,11.6715729 22,12.5 C22,13.3284271 21.3284271,14 20.5,14 L3.5,14 C2.67157288,14 2,13.3284271 2,12.5 C2,11.6715729 2.67157288,11 3.5,11 L20.5,11 Z M12.5,4 C13.3284271,4 14,4.67157288 14,5.5 C14,6.32842712 13.3284271,7 12.5,7 L3.5,7 C2.67157288,7 2,6.32842712 2,5.5 C2,4.67157288 2.67157288,4 3.5,4 L12.5,4 Z',
          opacity: 'M20.5,18 C21.3284271,18 22,18.6715729 22,19.5 C22,20.3284271 21.3284271,21 20.5,21 L8.5,21 C9.32842712,21 10,20.3284271 10,19.5 C10,18.7203039 9.40511192,18.0795513 8.64446001,18.0068666 L8.5,18 L20.5,18 Z M20.5,4 C21.3284271,4 22,4.67157288 22,5.5 C22,6.32842712 21.3284271,7 20.5,7 L15.5,7 C16.3284271,7 17,6.32842712 17,5.5 C17,4.72030388 16.4051119,4.07955132 15.64446,4.00686658 L15.5,4 L20.5,4 Z'
        }
      case 'insert':
        return {
          name: 'insert',
          fill: 'M13,4 L12.999,11 L19.999,11 C19.9995523,11 20,11.0004477 20,11.001 L20,13 L20,13 L12.999,13 L13,20 L11,20 L10.999,12.999 L4,13 L4,11 L10.999,10.999 L11,4 L13,4 Z',
          opacity: null
        }
      case 'exclude':
        return {
          name: 'exclude',
          fill: 'M7,9 L7,17 L15,17 L15,21 L3,21 L3,9 L7,9 Z M21,3.001 L21,15 L21,15 L17,15 L17,7 L9,7 L9,3 L20.999,3 C20.9995523,3 21,3.00044772 21,3.001 Z',
          opacity: 'M9,9 L14.999,9.00099983 C14.9995522,9.00100009 14.9999998,9.00144778 15,9.002 L15,15 L15,15 L9,14.999 L9,9 Z'
        }
      case 'align-bottom':
        return {
          name: 'align-bottom',
          fill: 'M21,19 L21,20 L3,20 L3,19 L21,19 Z M15,5 L15,17 L9,17 L9,5 L15,5 Z',
          opacity: null
        }
      case 'align-center':
        return {
          name: 'align-center',
          fill: 'M12,3 L12,9 L17.999,9 C17.9995523,9 18,9.00044772 18,9.001 L18,15 L18,15 L12,15 L12,21 L11,21 L11,15 L5,15 L5,9 L11,9 L11,3 L12,3 Z',
          opacity: null
        }
      case 'align-left':
        return {
          name: 'align-left',
          fill: 'M5,3 L5,21 L4,21 L4,3 L5,3 Z M19,9 L19,15 L7,15 L7,9 L19,9 Z',
          opacity: null
        }
      case 'align-middle':
        return {
          name: 'align-middle',
          fill: 'M15,5.001 L15,10.999 L15,10.999 L21,11 L21,12 L15,11.999 L15,18 L9,18 L9,12 L3,12 L3,11 L9,11 L9,5 L14.999,5 C14.9995523,5 15,5.00044772 15,5.001 Z',
          opacity: null
        }
      case 'align-right':
        return {
          name: 'align-right',
          fill: 'M20,3 L20,21 L19,21 L19,3 L20,3 Z M17,9 L17,15 L5,15 L5,9 L17,9 Z',
          opacity: null
        }
      case 'align-top':
        return {
          name: 'align-top',
          fill: 'M15,7 L15,19 L9,19 L9,7 L15,7 Z M21,4 L21,5 L3,5 L3,4 L21,4 Z',
          opacity: null
        }
      case 'group':
        return {
          name: 'group',
          fill: 'M4,20 L4,22 L2,22 L2,20 L4,20 Z M22,20 L22,22 L20,22 L20,20 L22,20 Z M18,10 L18,18 L10,18 L10,10 L18,10 Z M4,2 L4,4 L2,4 L2,2 L4,2 Z M22,2 L22,4 L20,4 L20,2 L22,2 Z',
          opacity: 'M19,20 L19,21 L5,21 L5,20 L19,20 Z M21,5 L21,19 L20,19 L20,5 L21,5 Z M4,5 L4,19 L3,19 L3,5 L4,5 Z M15,6 L15,8.57142857 L8.57142857,8.57142857 L8.57142857,15 L6,15 L6,6 L15,6 Z M19,3 L19,4 L5,4 L5,3 L19,3 Z'
        }
      case 'ungroup':
        return {
          name: 'ungroup',
          fill: 'M13,20 L13,22 L11,22 L11,20 L13,20 Z M22,20 L22,22 L20,22 L20,20 L22,20 Z M19,12 L19,14 L21,14 L21,19 L19,19 L19,21 L14,21 L14,19 L12,19 L12,14 L14,14 L14,12 L19,12 Z M4,11 L4,13 L2,13 L2,11 L4,11 Z M13,11 L13,13 L11,13 L11,11 L13,11 Z M22,11 L22,13 L20,13 L20,11 L22,11 Z M4,2 L4,4 L2,4 L2,2 L4,2 Z M13,2 L13,4 L11,4 L11,2 L13,2 Z',
          opacity: 'M10,3 L10,5 L12,5 L12,10 L10,10 L10,12 L5,12 L5,10 L3,10 L3,5 L5,5 L5,3 L10,3 Z'
        }
      case 'mask':
        return {
          name: 'mask',
          fill: 'M16.0566792,20.6980024 L16.3546361,21.6525817 C15.847026,21.8109856 15.3228978,21.9186671 14.7880039,21.973513 L14.3849047,22.0047076 L14.2171817,22.0117647 L14.1856696,21.0122613 L14.3325688,21.0060781 C14.8118374,20.9809607 15.2773132,20.9082021 15.7246478,20.7926318 L16.0566792,20.6980024 Z M10.3532316,20.0120132 C10.8264008,20.2976977 11.3353999,20.5286987 11.8710558,20.6967565 L12.1955747,20.7899719 L11.943458,21.7576689 C11.3244785,21.5960954 10.7289235,21.3607684 10.1685017,21.0579417 L9.83655827,20.8681959 L10.3532316,20.0120132 Z M19.4250036,18.3977506 L20.2048142,19.0237662 C19.80557,19.5207976 19.3485694,19.9686742 18.8440721,20.357346 L18.5357562,20.5833641 L17.9641611,19.7628282 C18.4230149,19.4429846 18.8410556,19.0699031 19.2097655,18.6530438 L19.4250036,18.3977506 Z M7.6653983,17.0693693 C7.91084113,17.5752374 8.21510088,18.0461686 8.56885344,18.4737675 L8.78696952,18.7250598 L8.04721755,19.3979396 C7.61793,18.9263246 7.2462845,18.4052716 6.94076601,17.8456772 L6.76545803,17.5053828 L7.6653983,17.0693693 Z M20.9313679,14.7231376 L21.9264404,14.8222895 C21.8624145,15.461036 21.722005,16.0857225 21.5096386,16.685155 L21.3736192,17.0416944 L20.4482102,16.6627245 C20.6561457,16.1545199 20.8058021,15.6173329 20.8892833,15.0599329 L20.9313679,14.7231376 Z M2,16 L2,2 L16,2 L16,16 L2,16 Z M15,3 L3,3 L3,15 L6.01450559,15.0007546 C6.00487984,14.8350654 6,14.6681026 6,14.5 C6,9.80557963 9.80557963,6 14.5,6 C14.6681026,6 14.8350654,6.00487984 15.0007546,6.01450559 L15,3 Z M21.1207246,10.43219 C21.4057947,11.0006944 21.6221993,11.6022295 21.7647046,12.2262375 L21.841298,12.6032547 L20.8567349,12.7782849 C20.7568253,12.217881 20.5907997,11.6818722 20.3673577,11.1780918 L20.2264721,10.8797536 L21.1207246,10.43219 Z M17.9916771,7.10130899 C18.5424241,7.42254861 19.0528929,7.80842959 19.5119541,8.24980783 L19.7811328,8.5212213 L19.0549764,9.20875111 C18.6719511,8.80365961 18.2414791,8.44480163 17.7730536,8.14072484 L17.4875197,7.96492089 L17.9916771,7.10130899 Z',
          opacity: null
        }
      case 'masked':
        return {
          name: 'masked',
          fill: 'M16.3507957,7 L16.3507957,8 L12.3535534,8 C11.5591397,8 10.9313732,8.49803106 10.8602672,9.10024572 L10.8535534,9.21428571 L10.853,17.646 L14,14.5 L14.7071068,15.2071068 L10.3535534,19.5606602 L6,15.2071068 L6.70710678,14.5 L9.853,17.646 L9.85355339,9.21428571 C9.85355339,8.02452219 10.8958722,7.0815326 12.1841832,7.0050157 L12.3535534,7 L16.3507957,7 Z',
          opacity: null
        }
      case 'masked-mask':
        return {
          name: 'masked-mask',
          fill: 'M9.78571429,4 L10.7857143,4 L10.7857143,12.1021746 C10.7857143,12.8965883 11.2837453,13.5243547 11.88596,13.5954608 L12,13.6021746 L17.9678766,13.602728 L14.8218766,10.455728 L15.5289834,9.74862118 L19.8825368,14.1021746 L15.5289834,18.455728 L14.8218766,17.7486212 L17.9678766,14.602728 L12,14.6021746 C10.8102365,14.6021746 9.86724689,13.5598558 9.79072998,12.2715447 L9.78571429,12.1021746 L9.78571429,4 Z',
          opacity: null
        }
      case 'start-recording':
        return {
          name: 'start-recording',
          fill: 'M12,6 C15.3137085,6 18,8.6862915 18,12 C18,15.3137085 15.3137085,18 12,18 C8.6862915,18 6,15.3137085 6,12 C6,8.6862915 8.6862915,6 12,6 Z',
          opacity: 'M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z'
        }
      case 'stop-recording':
        return {
          name: 'stop-recording',
          fill: 'M8.25,7 L15.75,7 C16.4403559,7 17,7.55964406 17,8.25 L17,15.75 C17,16.4403559 16.4403559,17 15.75,17 L8.25,17 C7.55964406,17 7,16.4403559 7,15.75 L7,8.25 C7,7.55964406 7.55964406,7 8.25,7 Z',
          opacity: 'M12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 Z M12,4 C7.581722,4 4,7.581722 4,12 C4,16.418278 7.581722,20 12,20 C16.418278,20 20,16.418278 20,12 C20,7.581722 16.418278,4 12,4 Z'
        }
      case 'preview':
        return {
          name: 'preview',
          fill: 'M19.5,12 L6.5,20 L6.5,4.00178956 C6.5,4.00123728 6.50044772,4.00078956 6.501,4.00078956 C6.50118506,4.00078956 6.50136649,4.00084092 6.5015241,4.00093791 L19.5,12 L19.5,12 Z',
          opacity: null
        }
      case 'rewind':
        return {
          name: 'rewind',
          fill: 'M21,6 L18.8666667,6 L18.8666667,10.8689927 C18.8666667,11.4042237 18.4548905,11.8453526 17.9243959,11.9056403 L17.8,11.9126618 L6.798,11.913 L10,8.48679212 L8.60987928,7 L3,13 L8.60987928,19 L10,17.5132079 L6.716,14 L17.8,14 C19.5041929,14 20.8972383,12.6965408 20.9945678,11.0529632 L21,10.8689927 L21,6 Z',
          opacity: null
        }
      case 'right-sidebar':
        return {
          name: 'right-sidebar',
          fill: 'M15.001,8 L21,8 L21,8 L21,21 L15,21 L15,8.001 C15,8.00044772 15.0004477,8 15.001,8 Z',
          opacity: 'M14,8 L14,21 L3,21 L3,8 L14,8 Z M21,3 L21,7 L3,7 L3,3.001 C3,3.00044772 3.00044772,3 3.001,3 L21,3 L21,3 Z'
        }
      case 'chevron-down':
        return {
          name: 'chevron-down',
          fill: 'M7 10l5 5 5-5H7z',
          opacity: null
        }
      case 'chevron-right':
        return {
          name: 'chevron-right',
          fill: 'M10 17l5-5-5-5v10z',
          opacity: null
        }
      case 'unite':
        return {
          name: 'unite',
          fill: 'M21,3 L21,15 L15,15 L15,21 L3,21 L3,9 L9,9 L9,3 L21,3 Z',
          opacity: null
        }
      case 'zoom-in':
        return {
          name: 'zoom-in',
          fill: 'M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 Z M13,6 L11,6 L11,11 L6,11 L6,13 L11,13 L11,18 L13,18 L13,13 L18,13 L18,11 L13,11 L13,6 Z',
          opacity: null
        }
      case 'zoom-out':
        return {
          name: 'zoom-out',
          fill: 'M12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 Z M18,11 L6,11 L6,13 L18,13 L18,11 Z',
          opacity: null
        }
      case 'vertical-flip':
        return {
          name: 'vertical-flip',
          fill: 'M20,11 L5.99576347,11 C5.99240132,11 5.32714683,8.33333333 4,3 L20,11 Z',
          opacity: 'M20,13 L4,21 L6,13.0087645 C6.00041555,13.0054269 10.6670822,13.0025054 20,13 Z'
        }
      case 'horizontal-flip':
        return {
          name: 'horizontal-flip',
          fill: 'M11,4 L3,20 L10.9912403,18 C10.9924855,17.9998443 10.9954054,13.3331777 11,4 Z',
          opacity: 'M13,4 L21,20 L13.0087645,17.9987964 C13.0054269,17.9983809 13.0025054,13.3321154 13,4 Z'
        }
      case 'distribute-vertically':
        return {
          name: 'distribute-vertically',
          fill: 'M21,19 L21,20 L3,20 L3,19 L21,19 Z M18,9 L18,15 L6,15 L6,9 L18,9 Z M21,4 L21,5 L3,5 L3,4 L21,4 Z',
          opacity: null
        }
      case 'distribute-horizontally':
        return {
          name: 'distribute-horizontally',
          fill: 'M5,3 L5,21 L4,21 L4,3 L5,3 Z M20,3 L20,21 L19,21 L19,3 L20,3 Z M15,6 L15,18 L9,18 L9,6 L15,6 Z',
          opacity: null
        }
      case 'trash-can':
        return {
          name: 'trash-can',
          fill: 'M17.8724112,8 C18.4246959,8 18.8724112,8.44771525 18.8724112,9 C18.8724112,9.03994328 18.870018,9.07985069 18.8652444,9.11950771 L17.6615407,19.1195077 C17.6010624,19.6219428 17.1747693,20 16.6687075,20 L8.33129253,20 C7.82523068,20 7.39893755,19.6219428 7.33845926,19.1195077 L6.13475556,9.11950771 C6.06875327,8.57118103 6.45975445,8.07316901 7.00808112,8.00716673 C7.04773814,8.0023932 7.08764555,8 7.12758883,8 L17.8724112,8 Z M15.5,10 C15.2545401,10 15.038674,10.1768752 14.9808857,10.4101244 L14.966876,10.5 L14.5031397,17.5 C14.4848459,17.7761424 14.6938733,18 14.9700157,18 C15.2154756,18 15.4313417,17.8231248 15.48913,17.5898756 L15.5031397,17.5 L15.966876,10.5 C15.9851699,10.2238576 15.7761424,10 15.5,10 Z M12.5,10 C12.2545401,10 12.0503916,10.1768752 12.0080557,10.4101244 L12,10.5 L12,17.5 C12,17.7761424 12.2238576,18 12.5,18 C12.7454599,18 12.9496084,17.8231248 12.9919443,17.5898756 L13,17.5 L13,10.5 C13,10.2238576 12.7761424,10 12.5,10 Z M9.5,10 C9.25454011,10 9.06306316,10.1768752 9.03743742,10.4101244 L9.03582054,10.5 L9.53730807,17.5 C9.55709121,17.7761424 9.79698624,18 10.0731286,18 C10.3185885,18 10.5100655,17.8231248 10.5356912,17.5898756 L10.5373081,17.5 L10.0358205,10.5 C10.0160374,10.2238576 9.77614237,10 9.5,10 Z M6.5,7 C6.22385763,7 6,6.77614237 6,6.5 C6,6.22385763 6.22385763,6 6.5,6 L10,6 L10,4.5 C10,4.22385763 10.2238576,4 10.5,4 L14.5,4 C14.7761424,4 15,4.22385763 15,4.5 L15,6 L18.5,6 C18.7761424,6 19,6.22385763 19,6.5 C19,6.77614237 18.7761424,7 18.5,7 L6.5,7 Z M14,5 L11,5 L11,6 L14,6 L14,5 Z',
          opacity: null
        }
      case 'justify-left':
        return {
          name: 'justify-left',
          fill: 'M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z',
          opacity: null
        }
      case 'justify-center':
        return {
          name: 'justify-center',
          fill: 'M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z',
          opacity: null
        }
      case 'justify-right':
        return {
          name: 'justify-right',
          fill: 'M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z',
          opacity: null
        }
      case 'thicc-chevron-down':
        return {
          name: 'thicc-chevron-down',
          fill: 'M17.9221027,7.65690583 L11.9999918,13.935 L6.07789728,7.65690583 C5.89831309,7.46652977 5.60230705,7.44684832 5.39909894,7.61177252 L4.68491362,8.19140709 C4.45910436,8.37467444 4.43674641,8.71124816 4.63633033,8.92277357 L11.6363303,16.341597 C11.7119065,16.421695 11.8112262,16.4740318 11.9191557,16.4917589 L12.0014807,16.4984579 C12.1391366,16.4984579 12.2707002,16.4416915 12.36516,16.3415592 L19.3637053,8.92273584 C19.5632531,8.7112047 19.5408797,8.37466147 19.3150864,8.19140709 L18.6009011,7.61177252 C18.397693,7.44684832 18.1016869,7.46652977 17.9221027,7.65690583 Z',
          opacity: null
        }
      case 'thicc-chevron-right':
        return {
          name: 'thicc-chevron-right',
          fill: 'M8.54725139,4.50184057 C8.40702241,4.51116302 8.27836793,4.57776654 8.19072815,4.68575017 L7.61177252,5.39909894 L7.55855217,5.47924325 C7.45443579,5.67448947 7.49032678,5.92076112 7.65690583,6.07789728 L13.935,12 L7.65690583,17.9221027 C7.46652977,18.1016869 7.44684832,18.397693 7.61177252,18.6009011 L8.19140709,19.3150864 C8.37467444,19.5408956 8.71124816,19.5632536 8.92277357,19.3636697 L16.3423679,12.3629423 C16.5515308,12.1655875 16.5515136,11.8329004 16.3423302,11.6355673 L8.92351955,4.63703405 C8.82235665,4.54160206 8.68601772,4.49261536 8.54725139,4.50184057 Z',
          opacity: null
        }
      case 'thicc-chevron-left':
        return {
          name: 'thicc-chevron-left',
          fill: 'M15.4519719,4.50184057 C15.5922009,4.51116302 15.7208554,4.57776654 15.8084952,4.68575017 L16.3874508,5.39909894 L16.4406712,5.47924325 C16.5447875,5.67448947 16.5088966,5.92076112 16.3423175,6.07789728 L10.0642233,12 L16.3423175,17.9221027 C16.5326936,18.1016869 16.552375,18.397693 16.3874508,18.6009011 L15.8078162,19.3150864 C15.6245489,19.5408956 15.2879752,19.5632536 15.0764498,19.3636697 L7.65685542,12.3629423 C7.44769251,12.1655875 7.44770977,11.8329004 7.65689315,11.6355673 L15.0757038,4.63703405 C15.1768667,4.54160206 15.3132056,4.49261536 15.4519719,4.50184057 Z',
          opacity: null
        }
      case 'switch-on':
        return {
          name: 'switch-on',
          fill: 'M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
          opacity: null
        }
      case 'switch-off':
        return {
          name: 'switch-off',
          fill: 'M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z',
          opacity: null
        }
      case 'move-forward':
        return {
          name: 'move-forward',
          fill: 'M11.5065755,2.00767379 L16.0813546,7.24918049 L14.5766326,8.56581225 L12.499,6.19139296 L12.499,16 L20,16 L20,21 L3,21 L3,16 L10.499,16 L10.499,6.19239296 L8.42340837,8.56584811 L6.91864537,7.24918049 L11.4924659,2.00863231 C11.4960975,2.00447136 11.5024146,2.00404222 11.5065755,2.00767379 Z',
          opacity: 'M9.5,11 L9.5,14.99 C9.5,14.9955228 9.49552285,15 9.49,15 L3,15 L3,11 L9.5,11 Z M20,11 L20,15 L13.51,15 C13.5044772,15 13.5,14.9955228 13.5,14.99 L13.5,11 L20,11 Z'
        }
      case 'move-backward':
        return {
          name: 'move-backward',
          fill: 'M11.4924659,21.9913677 L6.91864537,16.7508195 L6.91864537,16.7508195 L8.42336737,15.4341878 L10.501,17.808607 L10.501,8 L3,8 L3,3 L20,3 L20,8 L12.501,8 L12.501,17.807607 L14.5765916,15.4341519 L16.0813546,16.7508195 L11.5075341,21.9913677 C11.5039025,21.9955286 11.4975854,21.9959578 11.4934245,21.9923262 C11.4930836,21.9920287 11.4927634,21.9917085 11.4924659,21.9913677 Z',
          opacity: 'M13.5,13 L13.5,9.01 C13.5,9.00447715 13.5044772,9 13.51,9 L20,9 L20,13 L13.5,13 Z M3,13 L3,9 L9.49,9 C9.49552285,9 9.5,9.00447715 9.5,9.01 L9.5,13 L3,13 Z'
        }
      case 'stroke-cap-butt':
        return {
          name: 'stroke-cap-butt',
          fill: 'M10,11 L8,11 L8,13 L10,13 L10,11 Z M12,15 L6,15 L6,9 L12,9 L12,11 L18,11 L18,13 L12,13 L12,15 Z',
          opacity: 'M13,14 L18,14 L18,21 L7,21 L7,16 L13,16 L13,14 Z M18,3 L18,10 L13,10 L13,8 L7,8 L7,3 L18,3 Z'
        }
      case 'stroke-cap-round':
        return {
          name: 'stroke-cap-round',
          fill: 'M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z',
          opacity: 'M21,3 L21,10 L16,10 L16,8 L9,8 C8.48716416,8 8.06449284,8.38604019 8.00672773,8.88337887 L8,9 L8,15 C8,15.5128358 8.38604019,15.9355072 8.88337887,15.9932723 L9,16 L16,16 L16,14 L21,14 L21,21 L12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 L21,3 Z'
        }
      case 'stroke-cap-square':
        return {
          name: 'stroke-cap-square',
          fill: 'M15,9 L15,11 L20.99,11 C20.9955228,11 21,11.0044772 21,11.01 L21,12.99 C21,12.9955228 20.9955228,13 20.99,13 L15,13 L15,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z',
          opacity: 'M21,3.01 L21,10 L16,10 L16,8 L8,8 L8,16 L16,16 L16,14 L21,14 L21,20.99 C21,20.9955228 20.9955228,21 20.99,21 L3,21 L3,3 L20.99,3 C20.9955228,3 21,3.00447715 21,3.01 Z'
        }
      case 'stroke-join-miter':
        return {
          name: 'stroke-join-miter',
          fill: 'M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L13,15 L13,21 L11,21 L11,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z',
          opacity: 'M21,14 L21,21 L14,21 L14,16 L16,16 L16,14 L21,14 Z M21,3 L21,10 L16,10 L16,8 L8,8 L8,16 L10,16 L10,21 L3,21 L3,3 L21,3 Z'
        }
      case 'stroke-join-round':
        return {
          name: 'stroke-join-round',
          fill: 'M13,11 L11,11 L11,13 L13,13 L13,11 Z M15,15 L13,15 L13,21 L11,21 L11,15 L9,15 L9,9 L15,9 L15,11 L21,11 L21,13 L15,13 L15,15 Z',
          opacity: 'M21,14 L21,21 L14,21 L14,16 L16,16 L16,14 L21,14 Z M21,3 L21,10 L16,10 L16,8 L8,8 L8,16 L10,16 L10,21 L3,21 L3,8 C3,5.23857625 5.23857625,3 8,3 L21,3 Z'
        }
      case 'stroke-join-bevel':
        return {
          name: 'stroke-join-bevel',
          fill: 'M15,9 L15,11 L21,11 L21,13 L15,13 L15,15 L13,15 L13,21 L11,21 L11,15 L9,15 L9,9 L15,9 Z M13,11 L11,11 L11,13 L13,13 L13,11 Z',
          opacity: 'M21,14 L21,21 L14,21 L14,16 L16,16 L16,14 L21,14 Z M21,3 L21,10 L16,10 L16,8 L8,8 L8,16 L10,16 L10,21 L3,21 L3,8.00529368 L8,3 L21,3 Z'
        }
      case 'gear':
        return {
          name: 'gear',
          fill: 'M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z',
          opacity: null
        }
      case 'more':
        return {
          name: 'more',
          fill: 'M5,10 C6.1045695,10 7,10.8954305 7,12 C7,13.1045695 6.1045695,14 5,14 C3.8954305,14 3,13.1045695 3,12 C3,10.8954305 3.8954305,10 5,10 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z M19,10 C20.1045695,10 21,10.8954305 21,12 C21,13.1045695 20.1045695,14 19,14 C17.8954305,14 17,13.1045695 17,12 C17,10.8954305 17.8954305,10 19,10 Z',
          opacity: null
        }
      case 'folder':
        return {
          name: 'folder',
          fill: 'M21,9 L21,20 L3,20 L3,10.9459865 C3,10.4152528 3.41461342,9.97696592 3.94452998,9.94752611 L21,9 Z',
          opacity: 'M9,4 C10.480515,4 12.4648015,4 12.4648015,5.99987956 L21,6 L21,8 L3,8 L3,4 L9,4 Z'
        }
      case 'sort-alpha-asc':
        return {
          name: 'sort-alpha-asc',
          fill: 'M10.44,12.6 L10.44,15.192 L5.688,19.272 L5.688,19.488 L10.584,19.488 L10.584,21 L4.392,21 L4.392,18.408 L9.144,14.328 L9.144,14.112 L4.464,14.112 L4.464,12.6 L10.44,12.6 Z M18,3 L18,16 L21,16 L17,21 L13,16 L16,16 L16,3 L18,3 Z M8.988,2.6 L10.992,11 L9.336,11 L8.928,9.2 L6.072,9.2 L5.664,11 L4.008,11 L6.012,2.6 L8.988,2.6 Z M7.608,3.392 L7.392,3.392 L6.408,7.688 L8.58,7.688 L7.608,3.392 Z',
          opacity: null
        }
      case 'sort-alpha-dsc':
        return {
          name: 'sort-alpha-dsc',
          fill: 'M18,3 L18,16 L21,16 L17,21 L13,16 L16,16 L16,3 L18,3 Z M8.988,12.6 L10.992,21 L9.336,21 L8.928,19.2 L6.072,19.2 L5.664,21 L4.008,21 L6.012,12.6 L8.988,12.6 Z M7.608,13.392 L7.392,13.392 L6.408,17.688 L8.58,17.688 L7.608,13.392 Z M10.44,2.6 L10.44,5.192 L5.688,9.272 L5.688,9.488 L10.584,9.488 L10.584,11 L4.392,11 L4.392,8.408 L9.144,4.328 L9.144,4.112 L4.464,4.112 L4.464,2.6 L10.44,2.6 Z',
          opacity: null
        }
      case 'touch-cursor':
        return {
          name: 'touch-cursor',
          fill: 'M15,2 C18.8659932,2 22,5.13400675 22,9 C22,12.8659932 18.8659932,16 15,16 C11.1340068,16 8,12.8659932 8,9 C8,5.13400675 11.1340068,2 15,2 Z',
          opacity: 'M19.9203102,3.94974747 C22.6539803,6.68341751 22.6539803,11.1155724 19.9203102,13.8492424 L13.5563492,20.2132034 C10.8226791,22.9468735 6.39052429,22.9468735 3.65685425,20.2132034 C0.923184207,17.4795334 0.923184207,13.0473785 3.65685425,10.3137085 L10.0208153,3.94974747 C12.7544853,1.21607743 17.1866402,1.21607743 19.9203102,3.94974747 Z'
        }
      case 'ease-curve':
        return {
          name: 'ease-curve',
          fill: 'M18.5,2 C20.4329966,2 22,3.56700338 22,5.5 C22,7.43299662 20.4329966,9 18.5,9 C17.8976717,9 17.3308802,8.8478492 16.8359627,8.57988494 L8.57988494,16.8359627 C8.8478492,17.3308802 9,17.8976717 9,18.5 C9,20.4329966 7.43299662,22 5.5,22 C3.56700338,22 2,20.4329966 2,18.5 C2,16.5670034 3.56700338,15 5.5,15 C6.10273608,15 6.6698873,15.1523569 7.16504246,15.4206595 L15.4206595,7.16504246 C15.1523569,6.6698873 15,6.10273608 15,5.5 C15,3.56700338 16.5670034,2 18.5,2 Z M5.5,17 C4.67157288,17 4,17.6715729 4,18.5 C4,19.3284271 4.67157288,20 5.5,20 C6.32842712,20 7,19.3284271 7,18.5 C7,17.6715729 6.32842712,17 5.5,17 Z M18.5,4 C17.6715729,4 17,4.67157288 17,5.5 C17,6.32842712 17.6715729,7 18.5,7 C19.3284271,7 20,6.32842712 20,5.5 C20,4.67157288 19.3284271,4 18.5,4 Z',
          opacity: null
        }
      case 'search':
        return {
          name: 'search',
          fill: 'M11,3 C15.418278,3 19,6.581722 19,11 C19,12.8486595 18.3729536,14.5508646 17.3199461,15.9055298 L20.8284271,19.4142136 L19.4142136,20.8284271 L15.9055298,17.3199461 C14.5508646,18.3729536 12.8486595,19 11,19 C6.581722,19 3,15.418278 3,11 C3,6.581722 6.581722,3 11,3 Z M11,5 C7.6862915,5 5,7.6862915 5,11 C5,14.3137085 7.6862915,17 11,17 C14.3137085,17 17,14.3137085 17,11 C17,7.6862915 14.3137085,5 11,5 Z',
          opacity: null
        }
      case 'close':
        return {
          name: 'close',
          fill: 'M19.0710678,3.51471863 L20.4852814,4.92893219 L13.4137186,11.9997186 L20.4852814,19.0710678 L19.0710678,20.4852814 L11.9997186,13.4137186 L4.92893219,20.4852814 L3.51471863,19.0710678 L10.5857186,11.9997186 L3.51471863,4.92893219 L4.92893219,3.51471863 L11.9990115,10.5850115 C11.9994021,10.585402 12.0000352,10.585402 12.0004258,10.5850115 L19.0710678,3.51471863 L19.0710678,3.51471863 Z',
          opacity: null
        }
      case 'close-small':
        return {
          name: 'close-small',
          fill: 'M16.2426407,6.34314575 L17.6568542,7.75735931 L13.4141458,12.0001458 L17.6568542,16.2426407 L16.2426407,17.6568542 L12.0001458,13.4141458 L7.75735931,17.6568542 L6.34314575,16.2426407 L10.5861458,12.0001458 L6.34314575,7.75735931 L7.75735931,6.34314575 L12.0001456,10.5847316 C12.0005362,10.585122 12.0011693,10.5851219 12.0015599,10.5847315 L16.2426407,6.34314575 L16.2426407,6.34314575 Z',
          opacity: null
        }
    }
  })();
  return (
    <svg
      viewBox='0 0 24 24'
      width='24px'
      height='24px'
      style={{
        transform: small ? `scale(0.75)` : 'none',
        ...style
      }}>
      <path d={iconData.fill} />
      {
        iconData.opacity
        ? <path style={{ opacity: 0.5 }} d={iconData.opacity} />
        : null
      }
    </svg>
  )
}

const mapStateToProps = (state: RootState, ownProps: IconProps) => {
  const { layer } = state;
  let pathData = ownProps.name === 'shape' && ownProps.shapeId && layer.present.byId[ownProps.shapeId] ? (layer.present.byId[ownProps.shapeId] as em.Shape).pathData : null;
  if (pathData) {
    const layerIcon = new paperMain.CompoundPath({
      pathData: pathData,
      insert: false
    });
    layerIcon.fitBounds(new paperMain.Rectangle({
      point: new paperMain.Point(0,0),
      size: new paperMain.Size(24,24)
    }));
    pathData = layerIcon.pathData;
  }
  return { pathData };
};

export default connect(
  mapStateToProps
)(Icon);