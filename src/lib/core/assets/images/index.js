// To make images available to webpack and Rails Webpacker
//
// IMPORTANTE we need to import only images not referenced by Vue templates.

// This image is used by e-mail templates (in Rails) through `asset_pack_path`. Therefore, we must
// ensure Webpacker knows about it and creates an entry for it on manifest.json
import './logo.png'
