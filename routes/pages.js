
/*
 * GET Static Pages.
 */

//About
exports.about = function(req, res){
  res.render('pages/about', { title: 'About' });
};
//Contact
exports.contact = function(req, res){
	res.render('pages/contact', { title: 'Contact' });
};
//Faq
exports.faq = function(req, res){
	res.render('pages/faq', { title: 'Faq' });
};