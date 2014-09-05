$(document).ready(function(){
	$('#myForm').submit(function(evt){
		evt.preventDefault();
		var formData = $('#myForm').serialize();
		$.ajax({
			type: 'POST',
			url: '/',
			data: formData,
			accepts: "application/json; charset=utf-8"
		}).done(createList);

		function createList(response){
			$("ul").html("");
			console.log(response);
			$.each(response,function(idx,obj){
				$("ul").append('<li id="i-'+obj.id+'"><input type="text" id="item-'+obj.id+'" value="'+obj.item+'"><button id="btn-edit-'+obj.id+'">edit</button><button id="btn-delete-'+obj.id+'">delete</button></li>');

				if(obj.deleted){
					$("#i-"+obj.id).slideUp();
					$("#i-"+obj.id).hide();
				}

				var editBtn = "btn-edit-"+obj.id;
				$("#"+editBtn).click(function(evt){
					evt.preventDefault();
					console.log('calling edit:'+obj.item);
					obj.item = $("#item-"+obj.id).val(); 
					$.ajax({
						type: 'PUT',
						url: '/',
						data: obj,
						accepts: "application/json; charset=utf-8"
					}).done(createList);
				});

				var deleteBtn = "btn-delete-"+obj.id;
				$("#"+deleteBtn).click(function(evt){
					evt.preventDefault();
					console.log('calling delete:'+obj.item);
					$.ajax({
						type: 'DELETE',
						url: '/',
						data: obj,
						accepts: "application/json; charset=utf-8"
					}).done(createList);
				});
			});
		};
	});

});