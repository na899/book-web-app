var list=document.getElementsByTagName('li');

for(var i=0;i<list.length;i++){

	list[i].addEventListener('click',function(){
	console.log(this.id);

	fetch('book', {
                        headers: {
                                'Content-Type': 'application/json'
                        },

                        method:'put',
                        body: JSON.stringify({
                                'id': this.id
                        })
                })
                .then(response => {
                        if (response.ok) return console.log("hello");

                })
                .then(data => {
                        console.log(data);
                })

});
}
