
DEFAULT_BRANCH := main
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

.PHONY: bump-version/major
bump-version/major:  ## Increment the major version (X.y.z)
	BUMP_TYPE=major bump-my-version bump major

.PHONY: bump-version/minor
bump-version/minor:  ## Increment the minor version (x.Y.z)
	BUMP_TYPE=minor bump-my-version bump minor

.PHONY:  bump-version/patch
bump-version/patch:  ## Increment the patch version (x.y.Z)
	bump-my-version bump patch

.PHONY: release
release:  ## Push the new project version
	git push --follow-tags origin $(DEFAULT_BRANCH)