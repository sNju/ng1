// var person=function(val){
// 	this.val=val;
// 	//console.log("object created");
// }
// person.prototype.add=function(val){
// 	console.log("parent function call");
// 	return this.val+val;
// }

// var man=function(val){
// 	person.call(this,val)
// }

// man.prototype=new person();
// var man1=new man(10);

// var child=function(val){
// 	man.call(this,val);
// }

// child.prototype=Object.create(man.prototype);//  new man();
// var child1=new child(40);

// // var person1=new person(1);
// // var person2=new person(2);
// console.log("output=",child1.add(10));

