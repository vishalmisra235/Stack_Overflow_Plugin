//It will get the url of the current webpage and store it in the variable so_url
var so_url = window.location.href;
alert(so_url);
var final_set = new Set();
var language="";
var map_a_m = [];
var values = [];

//function will get the HTML data from the requested url.
function getData(url, callback){

    $.get(url, function(data)
    {
    	callback(data);
    }); 
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function extractDocument(){
	getData(so_url, function(data){
		get_Questions_Answers(data);
	});
}

function get_Questions_Answers(data){
	var dom = createElementFromHTML(data);
	var code = document.getElementsByClassName("prettyprinted");


	if(code.length>0)
	{
		var pln_class = document.getElementsByClassName("pln");
		var set_words = new Set();

		for(var i=0; i<pln_class.length; i++)
		{
			var text = pln_class[i].innerText;
			if(text!=" " || text!="\n")
			{
				set_words.add(text);
			}
		}
		console.log(set_words);
		var get1 = set_words.values();

		
		for(var j=0; j<code.length; j++)
		{
			var full_text = code[j].innerText;

			for(var k=0;k<full_text.length;k++)
			{
				var reg1 = /[\w]*(?=['('])(?!['"'|\w])/g;
				var test = full_text.match(reg1);

				if(test!=null)
				{
					for(var l=0;l<test.length;l++)
					{
						if(test[l]!="" && test[l]!="while" && test[l]!="for" && test[l]!="if" && test[l]!="else if" && test[l]!="else" && test[l]!="return" && test[l]!="function")
						{
							final_set.add(test[l]);
						}
					}
				}
			}
		}
		console.log(final_set);
	}
	
	var languages = document.getElementsByClassName("post-tag");
	var c=0;
	for(var j=0;j<languages.length;j++)
	{
		if(languages[j].innerText=='jquery')
		{
			language = 'jquery';c=1;
		}
	}
	if(c==0)
	{
		language = document.getElementsByClassName("post-tag")[0].innerText;
	}
	console.log(language);

	getMeaning();
}

function getMeaning()
{
	
	for (var it = final_set.values(), val= null; val=it.next().value; ) {
		//console.log(val);
    	
    	var ques = "What is ."+val+" in "+language;
    	var j_url = "https://www.google.com/search?q="+ques;

    	$.get(j_url, function(data){

    		var doc = $(data);
    		console.log($(data).find('span.ILfuVd').text());
    		var search = $(data).find('input.gsfi').attr('value');
    		var elements = search.split(" ");

    		values.push(elements[2]);
    		if($(data).find('span.ILfuVd').text()=="")
    		{
    			map_a_m.push("");
    		}
    		else
    		{
    			map_a_m.push($(data).find('span.ILfuVd').text());
    		}
 	    });
    }

    console.log("inside hover");
		$(document).ready(function(){
			$('span.pln').html(function(){

				var cont = [];
    			return "<span>" + $(this).text().split(" ").join("</span> <span>") + "</span>";
  				}).on("mouseover", "span", function() {
    			var hoveredWord = $(this).text();
    			console.log(hoveredWord);
    			var k=0;
    			for (var i=0; i<values.length; i++)
    			{
    				var word = "."+hoveredWord;
    				if(values[i] == word)
    				{
    					console.log(map_a_m[i]);
    					$('span.pln').attr({class :"pln", title:map_a_m[i]});
    					break;
    				}
    				else
    				{
    					$('span.pln').attr({class :"pln", title:""});
    				}
    				k=k+1;
    			}
			});
		});
}

extractDocument();
