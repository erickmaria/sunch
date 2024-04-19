
CURRENT_DIR := $(shell pwd)

define _build
	@docker run --rm \
		-v "$(CURRENT_DIR)":/project \
		-v "$(CURRENT_DIR)"/.cache/electron:/root/.cache/electron \
		-v "$(CURRENT_DIR)"/.cache/electron-builder:/root/.cache/electron-builder \
		electronuserland/builder:wine \
		/bin/bash -c "npm run build:$(1)"	
endef

.PHONY: build-linux
build-linux:
	$(call _build,linux)

.PHONY: build-win
build-win:
	$(call _build,win)

.PHONY: build-mac
build-mac:
	$(call _build,mac)

.PHONY: clean
clean:
	rm -rf releases/