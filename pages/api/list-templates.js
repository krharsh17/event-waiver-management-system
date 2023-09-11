import * as DropboxSign from "@dropbox/sign";
const templateApi = new DropboxSign.TemplateApi();
export default function handler(req, res) {

    templateApi.username = process.env.DROPBOX_SIGN_API_KEY;
    const result = templateApi.templateList();

    result.then(response => {
        res.status(200).json(response.body.templates.map(template =>
            ({
                id: template.templateId,
                name: template.title
            })
        ))
    }).catch(error => {
        console.log("Exception when calling Dropbox Sign API:");
        console.log(error.body);
    });
}
