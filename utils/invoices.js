var fs = require('fs');
var path = require('path');
var pdf = require('html-pdf');
const md5 = require('md5');
var html = fs.readFileSync(path.join(__dirname, './invoice.html'), 'utf8');

function multiReplace(obj, str) {
	var retStr = str;
	for (var x in obj) {
		retStr = retStr.replace(new RegExp(x, 'g'), obj[x]);
	}
	return retStr;
}

const generateInvoiceHTML = ({ reference = '', date = '', account = '', amount = '' }) => {
	return multiReplace(
		{ '{{amount}}': amount, '{{reference}}': reference, '{{date}}': date, '{{account}}': account },
		html
	);
};

const createAndSaveInvoicePdf = async (options = {}) =>
	new Promise(async (res, rej) => {
		const invoiceHTML = generateInvoiceHTML(options);

		const fileName = md5(`${options.date}.${options.account}`);
		const filePath = `${fileName}.pdf`;
		pdf.create(invoiceHTML, { format: 'Letter' }).toFile(
			path.join(process.cwd(), 'public', 'invoices', filePath),
			(err, result) => {
				if (err) return rej(err);
				res(result.filename); // { filename: '/app/businesscard.pdf' }
			}
		);
	});

export const handleInvoice = async (options = {}) => {
	const invoice = await createAndSaveInvoicePdf(options);
	console.log({ invoice });
	return invoice;
};

export const getInvoiceName = invoice => {
	const parsed = invoice.split('/');
	return parsed[parsed.length - 1];
};
