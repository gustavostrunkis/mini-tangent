const argv = require("node:process");
const fs = require("fs");

//var file_content = ""; // A string que contém todo o texto do arquivo especificado
//var file_out_content = ""; // A string que contém o texto do arquivo de saída

const input_file_name = process.argv[2];

const output_file_name = input_file_name.substring(0, input_file_name.indexOf(".", 1)) + ".css";

fs.readFile(input_file_name, (error, data) => {
    if (error) {
        console.error(error);
        return;
    }

    let file_content = new TextDecoder().decode(data);

    let lines_file_content = file_content.split("\n");

    lines_file_content = lines_file_content.filter((el) => el.indexOf("maxtg") == -1);
    lines_file_content = lines_file_content.filter((el) => el.indexOf("mintg") == -1);

    let old_file_content = lines_file_content.join("");

    pre_write_output_file(old_file_content);

    write_over(process_file_mintg(file_content, process_file_maxtg(file_content, old_file_content)));
});

function pre_write_output_file(old_file_content){

    let content = new TextEncoder().encode(old_file_content);

    fs.writeFile(output_file_name, content, error => {
        if(error){
            console.error(error);
            return;
        }
    });
}

function write_over(new_content){

    let content = new TextEncoder().encode(new_content);

    fs.writeFile(output_file_name, content, error => {
        if(error){
            console.error(error);
            return;
        }
    });
}

function process_file_maxtg(file_content, old_file_content_2){

    let file_out_content = "";

    let last_maxtg_found = 0;

    while(file_content.indexOf("maxtg", last_maxtg_found + 1) >= 0){
        let first_p = 0;
        let last_p = 0;
        let first_open_keys = 0;
        let double_dots = 0;

        let com_text = "";
        let obj_text = "";
        let prop_text = "";

        let coms = [];

        last_maxtg_found = file_content.indexOf("maxtg", last_maxtg_found + 1);
        
        first_p = file_content.indexOf("(", last_maxtg_found + 1);
        last_p = file_content.indexOf(")", last_maxtg_found + 1);
        first_open_keys = reverseIndex(reverseString(file_content).indexOf("{", reverseIndex(last_maxtg_found + 1, file_content.length)), file_content.length);
        double_dots = reverseIndex(reverseString(file_content).indexOf(":", reverseIndex(last_maxtg_found + 1, file_content.length)), file_content.length);

        com_text = file_content.substring(first_p + 1, last_p).trim();

        coms = com_text.split(",");

        obj_text = reverseString(reverseString(file_content).substring(reverseIndex(first_open_keys, file_content.length) + 1, reverseString(file_content).indexOf(reverseString("\n"), reverseIndex(first_open_keys, file_content.length))));
    
        prop_text = reverseString(reverseString(file_content).substring(reverseIndex(double_dots, file_content.length) + 1, reverseString(file_content).indexOf(reverseString("\n"), reverseIndex(double_dots, file_content.length)))).trim();

        let coms2 = [["", ""]];

        for(let i1 = 0; i1 < coms.length; i1++){
            coms2[i1] = coms[i1].split(":");
            
            coms2[i1][0] = coms2[i1][0].trim();
            coms2[i1][1] = coms2[i1][1].trim();
        }

        for(let i1 = 0; i1 < coms2.length; i1++){
            if(coms2[i1][0] == "d"){
                file_out_content += `\n${obj_text}{ ${prop_text}: ${coms2[i1][1]}; }\n`;
            }
            else{
                file_out_content += `\n@media (max-width: ${coms2[i1][0]}){ ${obj_text}{ ${prop_text}: ${coms2[i1][1]}; } }\n`;
            }   
        }
    }

    return old_file_content_2 + file_out_content;
}

function process_file_mintg(file_content, old_file_content_2){

    let file_out_content = "";

    let last_mintg_found = 0;

    while(file_content.indexOf("mintg", last_mintg_found + 1) >= 0){
        let first_p = 0;
        let last_p = 0;
        let first_open_keys = 0;
        let double_dots = 0;

        let com_text = "";
        let obj_text = "";
        let prop_text = "";

        let coms = [];

        last_mintg_found = file_content.indexOf("mintg", last_mintg_found + 1);
        
        first_p = file_content.indexOf("(", last_mintg_found + 1);
        last_p = file_content.indexOf(")", last_mintg_found + 1);
        first_open_keys = reverseIndex(reverseString(file_content).indexOf("{", reverseIndex(last_mintg_found + 1, file_content.length)), file_content.length);
        double_dots = reverseIndex(reverseString(file_content).indexOf(":", reverseIndex(last_mintg_found + 1, file_content.length)), file_content.length);

        com_text = file_content.substring(first_p + 1, last_p).trim();

        coms = com_text.split(",");

        obj_text = reverseString(reverseString(file_content).substring(reverseIndex(first_open_keys, file_content.length) + 1, reverseString(file_content).indexOf(reverseString("\n"), reverseIndex(first_open_keys, file_content.length))));
    
        prop_text = reverseString(reverseString(file_content).substring(reverseIndex(double_dots, file_content.length) + 1, reverseString(file_content).indexOf(reverseString("\n"), reverseIndex(double_dots, file_content.length)))).trim();

        let coms2 = [["", ""]];

        for(let i1 = 0; i1 < coms.length; i1++){
            coms2[i1] = coms[i1].split(":");
            
            coms2[i1][0] = coms2[i1][0].trim();
            coms2[i1][1] = coms2[i1][1].trim();
        }

        for(let i1 = 0; i1 < coms2.length; i1++){
            if(coms2[i1][0] == "d"){
                file_out_content += `\n${obj_text}{ ${prop_text}: ${coms2[i1][1]}; }\n`;
            }
            else{
                file_out_content += `\n@media (min-width: ${coms2[i1][0]}){ ${obj_text}{ ${prop_text}: ${coms2[i1][1]}; } }\n`;
            }   
        }
    }

    return old_file_content_2 + file_out_content;
}

function reverseString(str) {

    let splitString = str.split("");
 
    let reverseArray = splitString.reverse();
 
    let joinArray = reverseArray.join("");
    
    return joinArray;
}

function reverseIndex(index, length){
    return(length - index - 1);
}
