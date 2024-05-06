
CURRENT_DIR := $(shell pwd)

define _build
	@docker run --rm \
		-v "$(CURRENT_DIR)":/project \
		-v "$(CURRENT_DIR)"/.cache/electron:/root/.cache/electron \
		-v "$(CURRENT_DIR)"/.cache/electron-builder:/root/.cache/electron-builder \
		electronuserland/builder:wine \
		/bin/bash -c "npm run build:$(1)"
endef

.PHONY: electron-builder/linux
electron-builder/linux:
	$(call _build,linux)

.PHONY: electron-builder/windows
electron-builder/windows:
	$(call _build,windows)

.PHONY: electron-builder/macos
electron-builder/macos:
	$(call _build,mac)


.PHONY: electron-builder/all
electron-builder/all:
	$(call _build,all)

.PHONY: clean
clean:
	rm -rf release/