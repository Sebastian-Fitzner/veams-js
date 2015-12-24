/**
 * Const for events (pub/sub)
 *
 * @author: Sebastian Fitzner
 */

const EVENTS = {
	btnClose: 'button:close',
	btnOpen: 'button:open',
	DOMchanged: 'DOMchanged',
	DOMredirect: 'dom:redirect',
	equalRender: 'equal:render',
	formComplete: 'form:complete',
	formReset: 'form:reset',
	mediachange: 'mediachange',
	paginationClose: 'pagination:closed',
	paginationRendered: 'pagination:rendered',
	resize: 'resize',
	scroll: 'scroll',
	selectChanged: 'select:changed',
	selectRendered: 'select:rendered',
	toggleContent: 'toggle:toggleContent',
	uiOverlayPopulate: 'overlay:populate',
	uiOverlayClose: 'uiOverlay:populate'
};

export default EVENTS;
