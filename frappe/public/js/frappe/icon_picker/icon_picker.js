class Picker {
	constructor(opts) {
		this.parent = opts.parent;
		this.width = opts.width;
		this.height = opts.height;
		this.set_icon(opts.icon);
		this.icons = opts.icons;
		this.setup_picker();
	}

	refresh() {
		this.update_icon_selected(true);
	}

	setup_picker() {
		this.icon_picker_wrapper = $(`
			<div class="icon-picker">
				<div class="search-icons">
					<input type="search" placeholder="Search for icons.." class="form-control">
					<span class="search-icon material-symbols-rounded">search</span>
				</div>
				<div class="icon-section">
					<div class="icons"></div>
				</div>
			</div>
		`);
		this.parent.append(this.icon_picker_wrapper);
		this.icon_wrapper = this.icon_picker_wrapper.find(".icons");
		this.search_input = this.icon_picker_wrapper.find(".search-icons > input");
		this.refresh();
		this.setup_icons();
	}

	setup_icons() {
        // Initially, only set up the selected icon if it exists
        if (this.icon) {
            let $icon = $(`<div id="${this.icon}" class="icon-wrapper material-symbols-rounded">${this.icon}</div>`);
            this.icon_wrapper.append($icon);
            $icon.on("click", () => {
				
				this.set_icon(this.icon);
				this.update_icon_selected(); // This will now also update the UI and notify ControlIcon
			});
        }

        this.search_input.keyup((e) => {
            e.preventDefault();
            this.filter_icons();
        });

        this.search_input.on("search", () => {
            this.filter_icons();
        });
    }

    filter_icons() {
        let value = this.search_input.val().toLowerCase();
        console.log("Search value:", value);

        // Check if the input length is more than 3 characters
		if (value.length >= 3) {
			// Clear the current icons display
			this.icon_wrapper.empty();

			// Append icons that match the search criteria
			this.icons.filter(icon => icon.includes(value)).forEach(icon => {
				let $icon = $(`<div id="${icon}" class="icon-wrapper material-symbols-rounded">${icon}</div>`);
				this.icon_wrapper.append($icon);
				$icon.on("click", () => {
					this.set_icon(icon);
					this.update_icon_selected();
				});
				$icon.keydown((e) => {
					const key_code = e.keyCode;
					if ([13, 32].includes(key_code)) {
						e.preventDefault();
						this.set_icon(icon);
						this.update_icon_selected();
					}
				});
			});
		} else {
			// Optionally, clear the icons display or show some default state if the input is less than 4 characters
			this.icon_wrapper.empty();
			// You could also display a message or keep the icons as they were before
		}
	}

	update_icon_selected(silent) {
		!silent && this.on_change && this.on_change(this.get_icon());
	}

	set_icon(icon) {
		this.icon = icon || "folder";
		this.update_icon_selected(); // Call this to visually update the selected icon
		this.refresh(); // Refresh the picker UI to reflect the current icon

	}

	get_icon() {
		return this.icon || "folder";
	}
}

export default Picker;
