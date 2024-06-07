import Widget from "./base_widget.js";

frappe.provide("frappe.utils");

export default class NumberCardWidget extends Widget {
	constructor(opts) {
		opts.shadow = true;
		super(opts);
	}

	get_config() {
		return {
			name: this.name,
			number_card_name: this.number_card_name,
			label: this.label,
			color: this.color,
			hidden: this.hidden,
		};
	}

	refresh() {
		this.set_body();
	}

	hexToRgbA(hex, alpha) {
		// Remove the '#' character if present
		hex = hex.replace(/^#/, '');
	
		// Parse the r, g, b values
		let r = parseInt(hex.substring(0, 2), 16);
		let g = parseInt(hex.substring(2, 4), 16);
		let b = parseInt(hex.substring(4, 6), 16);
	
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	set_body() {

		frappe.model.with_doc("Number Card", this.number_card_name || this.name).then((card) => {
			if (!card) {
				// this.widget.attr("style", `background-image: url('data:image/svg+xml,<svg width="671" height="657" viewBox="0 0 671 657" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.25" filter="url(%23filter0_f_11_79)"><ellipse cx="335.5" cy="328.5" rx="185.5" ry="178.5" fill="url(%23paint0_linear_11_79)"/></g><defs><filter id="filter0_f_11_79" x="0" y="0" width="671" height="657" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_11_79"/></filter><linearGradient id="paint0_linear_11_79" x1="335.5" y1="150" x2="335.5" y2="507" gradientUnits="userSpaceOnUse"><stop stop-color="${encodeURIComponent('#0066cc')}"/><stop offset="1" stop-color="${encodeURIComponent('#0066cc')}"/></linearGradient></defs></svg>');`);
				// this.widget.prepend('<div class="widget-gradient" style="position: relative;"><div class="inner-gradient-spatial"></div></div>');
				this.widget.attr(`style`,`background-size: calc(100% + 20px) auto; background: linear-gradient(to right, #fff 0, transparent 100px) left 0px top, linear-gradient(to left, #fff 0, transparent 100px) right 0px top, linear-gradient(to top, ${card && card.color ? this.hexToRgbA(card.color, '0.08') : this.hexToRgbA('#0066cc', '0.08')} 0px, #fff 60px) left -10px top !important;`);
				
		
			} else {
				// console.log("🚀 ~ file: number_card_widget.js:62 ~ NumberCardWidget ~ .then ~ card:", card)
				// this.widget.attr("style", `background-image: url('data:image/svg+xml,<svg width="671" height="657" viewBox="0 0 671 657" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.25" filter="url(%23filter0_f_11_79)"><ellipse cx="335.5" cy="328.5" rx="185.5" ry="178.5" fill="url(%23paint0_linear_11_79)"/></g><defs><filter id="filter0_f_11_79" x="0" y="0" width="671" height="657" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_11_79"/></filter><linearGradient id="paint0_linear_11_79" x1="335.5" y1="150" x2="335.5" y2="507" gradientUnits="userSpaceOnUse"><stop stop-color="${encodeURIComponent(card && card.color ? card.color : '#0066cc')}"/><stop offset="1" stop-color="${encodeURIComponent(card && card.color ? card.color : '#0066cc')}"/></linearGradient></defs></svg>');`);
				// this.widget.prepend(`<div class="widget-gradient" style="position: relative;"><div class="inner-gradient-spatial" style="background-image: conic-gradient(from 180deg at 50% 50%, ${card && card.color ? card.color : '#0066cc'}, ${card && card.color ? card.color : '#0066cc'}, rgba(191, 219, 254, 0)) !important"></div></div>`);
				this.widget.attr(`style`,`background-size: calc(100% + 20px) auto; background: linear-gradient(to right, #fff 0, transparent 100px) left 0px top, linear-gradient(to left, #fff 0, transparent 100px) right 0px top, linear-gradient(to top, ${card && card.color ? this.hexToRgbA(card.color, '0.08') : this.hexToRgbA('#0066cc', '0.08')} 0px, #fff 60px) left -10px top !important;`);
		
			}
		});
		this.widget.addClass("number-widget-box");
		this.make_card();
	}

	make_card() {
		frappe.model.with_doc("Number Card", this.number_card_name || this.name).then((card) => {
			if (!card) {
				if (this.document_type) {
					frappe.run_serially([
						() => this.create_number_card(),
						() => this.render_card(),
					]);
				} else {
					// widget doesn't exist so delete
					this.delete(false);
					return;
				}
			} else {
				this.card_doc = card;
				this.render_card();
			}

			this.set_events();
		});
	}

	create_number_card() {
		this.set_doc_args();
		return frappe
			.xcall("frappe.desk.doctype.number_card.number_card.create_number_card", {
				args: this.card_doc,
			})
			.then((doc) => {
				this.name = doc.name;
				this.card_doc = doc;
				
				this.widget.attr("data-widget-name", this.name);
				// this.widget.attr("style", `background-image: url('data:image/svg+xml,<svg width="671" height="657" viewBox="0 0 671 657" fill="none" xmlns="http://www.w3.org/2000/svg"><g opacity="0.25" filter="url(%23filter0_f_11_79)"><ellipse cx="335.5" cy="328.5" rx="185.5" ry="178.5" fill="url(%23paint0_linear_11_79)"/></g><defs><filter id="filter0_f_11_79" x="0" y="0" width="671" height="657" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur stdDeviation="75" result="effect1_foregroundBlur_11_79"/></filter><linearGradient id="paint0_linear_11_79" x1="335.5" y1="150" x2="335.5" y2="507" gradientUnits="userSpaceOnUse"><stop stop-color="${encodeURIComponent(this.card_doc && this.card_doc.color ? this.card_doc.color : '#0066cc')}"/><stop offset="1" stop-color="${encodeURIComponent(this.card_doc && this.card_doc.color ? this.card_doc.color : '#0066cc')}"/></linearGradient></defs></svg>');`);
		});
	}

	set_events() {
		$(this.body).click(() => {
			if (this.in_customize_mode) return;
			this.set_route();
		});
	}

	set_route() {
		if (this.card_doc.type === "Custom") {
			this.set_route_for_custom_card();
			return;
		}

		const is_document_type = this.card_doc.type !== "Report";
		const name = is_document_type ? this.card_doc.document_type : this.card_doc.report_name;
		const route = frappe.utils.generate_route({
			name: name,
			type: is_document_type ? "doctype" : "report",
			is_query_report: !is_document_type,
		});

		if (is_document_type) {
			const filters = JSON.parse(this.card_doc.filters_json);
			frappe.route_options = filters.reduce((acc, filter) => {
				return Object.assign(acc, {
					[`${filter[0]}.${filter[1]}`]: [filter[2], filter[3]],
				});
			}, {});
		}

		frappe.set_route(route);
	}

	set_route_for_custom_card() {
		if (!this.data?.route) return;

		if (this.data.route_options) {
			frappe.route_options = this.data.route_options;
		}

		frappe.set_route(this.data.route);
	}

	set_doc_args() {
		this.card_doc = Object.assign(
			{},
			{
				document_type: this.document_type,
				label: this.label,
				function: this.function,
				aggregate_function_based_on: this.aggregate_function_based_on,
				color: this.color,
				filters_json: this.stats_filter,
			}
		);
	}

	get_settings(type) {
		this.filters = this.get_filters();
		const settings_map = {
			Custom: {
				method: this.card_doc.method,
				args: {
					filters: this.filters,
				},
				get_number: (res) => this.get_number_for_custom_card(res),
			},
			Report: {
				method: "frappe.desk.query_report.run",
				args: {
					report_name: this.card_doc.report_name,
					filters: this.filters,
					ignore_prepared_report: 1,
				},
				get_number: (res) => this.get_number_for_report_card(res),
			},
			"Document Type": {
				method: "frappe.desk.doctype.number_card.number_card.get_result",
				args: {
					doc: this.card_doc,
					filters: this.filters,
				},
				get_number: (res) => this.get_number_for_doctype_card(res),
			},
		};
		return settings_map[type];
	}

	get_filters() {
		const filters = frappe.dashboard_utils.get_all_filters(this.card_doc);
		return filters;
	}

	async render_card() {
		this.prepare_actions();
		this.set_title();
		this.set_loading_state();

		if (!this.card_doc.type) {
			this.card_doc.type = "Document Type";
		}

		this.settings = this.get_settings(this.card_doc.type);
		await this.get_data();

		this.render_number();
		this.render_stats();
	}

	set_loading_state() {
		$(this.body).html(`<div class="number-card-loading text-muted">
			${__("Loading...")}
		</div>`);
	}

	async get_data() {
		this.data = await frappe.xcall(this.settings.method, this.settings.args);
		return this.settings.get_number(this.data);
	}

	get_number_for_custom_card(res) {
		if (typeof res === "object") {
			this.number = res.value;
			this.set_formatted_number(res);
		} else {
			this.formatted_number = res;
		}
	}

	get_number_for_doctype_card(res) {
		this.number = res;
		if (this.card_doc.function !== "Count") {
			return frappe.model.with_doctype(this.card_doc.document_type, () => {
				const based_on_df = frappe.meta.get_docfield(
					this.card_doc.document_type,
					this.card_doc.aggregate_function_based_on
				);
				this.set_formatted_number(based_on_df);
			});
		} else {
			this.formatted_number = res;
		}
	}

	get_number_for_report_card(res) {
		const field = this.card_doc.report_field;
		const vals = res.result.reduce((acc, col) => {
			col[field] && acc.push(col[field]);
			return acc;
		}, []);
		const col = res.columns.find((col) => col.fieldname == field);
		this.number = frappe.report_utils.get_result_of_fn(this.card_doc.report_function, vals);
		this.set_formatted_number(col);
	}

	set_formatted_number(df) {
		const default_country = frappe.sys_defaults.country;
		const shortened_number = frappe.utils.shorten_number(this.number, default_country, 5);
		let number_parts = shortened_number.split(" ");

		const symbol = number_parts[1] || "";
		number_parts[0] = window.convert_old_to_new_number_format(number_parts[0]);
		const formatted_number = $(frappe.format(number_parts[0], df)).text();

		this.formatted_number = formatted_number + " " + __(symbol);
	}

	render_number() {
		const style_attr = this.card_doc.color ? `style="color: ${this.card_doc.color};"` : "";

		$(this.body).html(`<div class="widget-content">
			<div class="number" ${style_attr}>${this.formatted_number}</div>
			</div>`);
	}

	render_stats() {
		if (this.card_doc.type !== "Document Type" || !this.card_doc.show_percentage_stats) {
			return;
		}

		let caret_html = "";
		let color_class = "";

		return this.get_percentage_stats().then(() => {
			if (this.percentage_stat == 0 || this.percentage_stat == undefined) {
				color_class = "grey-stat";
			} else if (this.percentage_stat > 0) {
				caret_html = `<span class="indicator-pill-round green">
						${frappe.utils.icon("arrow-up-right", "xs")}
					</span>`;
				color_class = "green-stat";
			} else {
				caret_html = `<span class="indicator-pill-round red">
						${frappe.utils.icon("arrow-down-left", "xs")}
					</span>`;
				color_class = "red-stat";
			}

			const stats_qualifier_map = {
				Daily: __("since yesterday"),
				Weekly: __("since last week"),
				Monthly: __("since last month"),
				Yearly: __("since last year"),
			};
			const stats_qualifier = stats_qualifier_map[this.card_doc.stats_time_interval];

			let stat = (() => {
				if (this.percentage_stat == undefined) return NaN;
				const parts = this.percentage_stat.split(" ");
				const symbol = parts[1] || "";
				return Math.abs(parts[0]) + " " + symbol;
			})();

			// don't show stats if not valid number - skip showing `NaN %` in card
			if (isNaN(stat)) return;

			$(this.body).find(".widget-content").append(`<div class="card-stats ${color_class}">
				<span class="percentage-stat-area">
					${caret_html}
					<span class="percentage-stat">
						${stat} %
					</span>
				</span>
				<span class="stat-period text-muted">
					${stats_qualifier}
				</span>
			</div>`);
		});
	}

	get_percentage_stats() {
		return frappe
			.xcall("frappe.desk.doctype.number_card.number_card.get_percentage_difference", {
				doc: this.card_doc,
				filters: this.filters,
				result: this.number,
			})
			.then((res) => {
				if (res !== undefined) {
					this.percentage_stat = frappe.utils.shorten_number(res);
				}
			});
	}

	prepare_actions() {
		if (this.in_customize_mode) return;

		let actions = [
			{
				label: __("Refresh"),
				action: "action-refresh",
				handler: () => {
					this.render_card();
				},
			},
			{
				label: __("Edit"),
				action: "action-edit",
				handler: () => {
					let number_card = this.number_card_name || this.name;
					frappe.set_route("Form", "Number Card", number_card);
				},
			},
		];

		this.set_card_actions(actions);
	}

	set_card_actions(actions) {
		/* eslint-disable indent */
		this.card_actions = $(`<div class="card-actions dropdown">
				<a data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
				...
				</a>
				<ul class="dropdown-menu" style="max-height: 300px; overflow-y: auto;">
					${actions
						.map(
							(action) =>
								`<li class="dropdown-item">
									<a data-action="${action.action}">${action.label}</a>
								</li>`
						)
						.join("")}
				</ul>
			</div>`);
		/* eslint-disable indent */

		this.card_actions.find("a[data-action]").each((i, o) => {
			const action = o.dataset.action;
			$(o).click(actions.find((a) => a.action === action));
		});

		this.action_area.html(this.card_actions);
	}
}
