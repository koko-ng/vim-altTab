SHELL := /bin/bash

# Replace these with the name and domain of your extension!
NAME     := vim-altTab
DOMAIN   := kokong.info
ZIP_NAME := $(NAME)@$(DOMAIN).zip

# These files will be included in the extension zip. If you have additional files in your
# extension, these should be added here.
JS_FILES    = $(shell find -type f -and \( -name "*.js" \))
ZIP_CONTENT = $(JS_FILES) metadata.json COPYING

# These four recipes can be invoked by the user.
.PHONY: zip install uninstall clean

# The zip recipes only bundles the extension without installing it.
zip: $(ZIP_NAME)

# The install recipes creates the extension zip and installs it.
install: $(ZIP_NAME)
	gnome-extensions install "$(ZIP_NAME)" --force
	@echo "Extension installed successfully! Now restart the Shell ('Alt'+'F2', then 'r')."

# This uninstalls the previously installed extension.
uninstall:
	gnome-extensions uninstall "$(NAME)@$(DOMAIN)"

# This removes all temporary files created with the other recipes.
clean:
	rm -f $(ZIP_NAME)

# This bundles the extension and checks whether it is small enough to be uploaded to
# extensions.gnome.org. We do not use "gnome-extensions pack" for this, as this is not
# readily available on the GitHub runners.
$(ZIP_NAME): $(ZIP_CONTENT)
	@echo "Packing zip file..."
	@rm --force $(ZIP_NAME)
	@zip $(ZIP_NAME) -- $(ZIP_CONTENT)

	@#Check if the zip size is too big to be uploaded
	@SIZE=$$(unzip -Zt $(ZIP_NAME) | awk '{print $$3}') ; \
	 if [[ $$SIZE -gt 5242880 ]]; then \
	    echo "ERROR! The extension is too big to be uploaded to" \
	         "the extensions website, keep it smaller than 5 MB!"; \
	    exit 1; \
	 fi
