import React from 'react';
import { shallow } from 'enzyme';
import Icon from 'components/Icon';
import facebookIcon from 'images/sprite/facebook.svg';

describe('<Icon />', () => {
  it('should render correct svg', () => {
    const renderedComponent = shallow(<Icon glyph={facebookIcon} />);
    expect(renderedComponent.find('svg').prop('viewBox')).toEqual(
      facebookIcon.viewBox
    );
    expect(renderedComponent.find('use').prop('xlinkHref')).toEqual(
      `#${facebookIcon.id}`
    );
  });
  it('should have correct class from prop `className`', () => {
    const renderedComponent = shallow(
      <Icon className="Hello" glyph={facebookIcon} />
    );
    expect(renderedComponent.hasClass('Hello')).toEqual(true);
  });
  it('should have proper width and height', () => {
    const renderedComponent = shallow(
      <Icon glyph={facebookIcon} width={20} height={25} />
    );
    expect(renderedComponent.find('svg').prop('width')).toEqual(20);
    expect(renderedComponent.find('svg').prop('height')).toEqual(25);
  });
  it('should have proper size', () => {
    const renderedComponent = shallow(<Icon glyph={facebookIcon} size={30} />);
    expect(renderedComponent.find('svg').prop('width')).toEqual(30);
    expect(renderedComponent.find('svg').prop('height')).toEqual(30);
  });
});
