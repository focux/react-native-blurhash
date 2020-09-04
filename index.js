const React = require('react');
const { requireNativeComponent, NativeModules } = require('react-native');
const { decode83, decodeDC } = require('./utils');

// TODO: use memo to fix "Invariant Violation: Tried to register two views with the same name BlurhashView" error
// NativeModules automatically resolves 'BlurhashView' to 'BlurhashViewModule'
const BlurhashModule = NativeModules.BlurhashView;

class Blurhash extends React.Component {
	constructor() {
		super();
		this._onLoadStart = this._onLoadStart.bind(this);
		this._onLoadEnd = this._onLoadEnd.bind(this);
		this._onLoadError = this._onLoadError.bind(this);
	}

	_onLoadStart() {
		if (this.props.onLoadStart != null) this.props.onLoadStart();
	}
	_onLoadEnd() {
		if (this.props.onLoadEnd != null) this.props.onLoadEnd();
	}
	_onLoadError(event) {
		if (this.props.onLoadError != null) this.props.onLoadError(event?.nativeEvent?.message);
	}

	render() {
		const { onLoadStart: _, onLoadEnd: __, onLoadError: ___, ...props } = this.props;
		return <NativeBlurhashView {...props} onLoadStart={this._onLoadStart} onLoadEnd={this._onLoadEnd} onLoadError={this._onLoadError} />;
	}
}

Blurhash.encode = (imageUri, componentsX, componentsY) => {
	if (typeof imageUri !== 'string') throw new Error('imageUri must be a non-empty string!');
	if (typeof componentsX !== 'number') throw new Error('componentsX must be a valid positive number!');
	if (typeof componentsY !== 'number') throw new Error('componentsY must be a valid positive number!');

	return BlurhashModule.createBlurhashFromImage(imageUri, componentsX, componentsY);
};

Blurhash.getAverageColor = (blurhash) => {
	if (blurhash == null || blurhash.length < 7) return undefined;

	const value = decode83(blurhash.substring(2, 6));
	return decodeDC(value);
};

// requireNativeComponent automatically resolves 'BlurhashView' to 'BlurhashViewManager'
const NativeBlurhashView = requireNativeComponent('BlurhashView', Blurhash);
module.exports = { Blurhash };
