# mini-tangent

To use it, just install the package, with ```npm install mini-tangent --save-dev```; then, insert the following instruction in your package.json file:

in "scripts": {
    ```"minitg": "node ./node_modules/mini-tangent/minitg.js <relative_path_to_your_source_tgcss_file>"```
}

finally, every time you want to "compile" your css, just run ```npm run minitg``` in your command line.