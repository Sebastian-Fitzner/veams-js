import Helpers from '../../utils/helpers';
import App from '../../app';
import SelectFx from '../select/select';
import AppModule from '../_global/moduleView';

var $ = App.$;

class Form extends AppModule {
	constructor(obj) {
		var options = {};

		super(obj, options);
	}

	initialize() {
		this.form = this.$el.find('form');
	}

	render() {
		Helpers.forEach($('select', this.$el), (i, el) => {
			new SelectFx({
				el: $(el),
				options: $(el).data('js-options')
			});
		});
	}
}

// Returns constructor
export default Form;