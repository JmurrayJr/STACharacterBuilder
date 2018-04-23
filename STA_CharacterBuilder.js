//Classes
class JsonData {
	constructor(fileName,dataContainer){	
		this.data = {};
		this.fileName = fileName;
		this.dataContainer = dataContainer;
		this.load();
	}
	item(nameOrID){
		
		var foundItem = null;

		if(isNaN(nameOrID)){
	
			$(this.data).each(function(key,value){
	
				if(value.Name == nameOrID){
	
					foundItem = value;
	
				}
	
			});
	
		} else {
			
			$(this.data).each(function(key,value){
	
				if(value.id == nameOrID){
	
					foundItem = value;
	
				}
	
			});
	
		}
	
		return foundItem;
	}	
	create(){	
		if(document.getElementById(this.dataContainer)==null){
			console.log('Missing ' + this.dataContainer + '. Creating Script Object');
			var container = document.createElement('script');
			container.id = this.dataContainer;
			container.type = 'application/json';
			document.getElementById('CharacterBuilderPlaceHolder').parentElement.insertBefore(container, document.getElementById('CharacterBuilderPlaceHolder'));;
		}
	}
	save(){
		document.getElementById(this.dataContainer).innerHTML = JSON.stringify(this.data);
	}
	load(override = false){
		this.create(this.dataContainer);
		if(document.getElementById(this.dataContainer).innerHTML == "" || override == true){
			console.log(this.dataContainer + ' is missing JSON Data. Loading from file ' + this.fileName);
			this.loadFromDisk();
			this.save();
		}
		else {
			console.log(this.dataContainer + ' contains JSON Data.');
			this.data = JSON.parse(document.getElementById(this.dataContainer).innerHTML);
		}
	}
	loadFromDisk(){
		console.log('Loading ' + this.fileName);
		var xhr = new XMLHttpRequest();
		xhr.open('GET', this.fileName ,false); //Not killing myself making this one time compile async as these must be run in order
		xhr.send();	
		this.data = JSON.parse(xhr.response);
	}
}
class CharacterCreationForm {
	constructor(){
		var form = this;
		console.log('Starting CharacterCreationForm');
		if(document.readyState === "complete"){
			form.createForm();
			form.updateView();
			form.addEvents();
		} else {
			 window.addEventListener('load',function(){
				form.createForm();
				form.updateView();
				form.addEvents();
			});
		}
	}
	createForm(){
		$('div[aria-describedby="NewCharacterDialog"]').remove();
		$('#NewCharacterForm').remove();

		var newCharacterForm = document.createElement('div');
		newCharacterForm.id = 'NewCharacterForm';
		document.body.appendChild(newCharacterForm);
		newCharacterForm.innerHTML = document.getElementById('CharacterBuilderTemplate').innerHTML;
		
		this.populateSelects('speciesSelect',species.data);
		this.populateSelects('environmentSelect',environments.data);
		this.populateSelects('upbringingSelect',upbringing.data);
		this.populateSelects('careerSelect',career.data);
		this.populateSelects('starfleetTrackSelect',starfleetTrack.data);
		this.populateSelects('careerEventsSelect',careerEvents.data);
	}
	updateView(){
		var form = this;	
		if($('#NewCharacterDialog').dialog('instance')){
			
			$('#NewCharacterDialog').dialog('option','width',(window.innerWidth)*.7);
			$('#NewCharacterAccordion').accordion('option','heightStyle','content');
			
		} else {		
			$('#NewCharacterDialog').dialog({
				width: (window.innerWidth)*.7,
				resize: function() {
					$( "#NewCharacterAccordion" ).accordion( "refresh" );
				}
			});
			$('#NewCharacterAccordion').accordion({
				heightStyle: "content",
				activate: function(event,ui){
					if(ui.newPanel[0].id == "Adjustments"){
						form.updateAdjustments();
					}
				}
			});
		}
		$('.attributeSlider').each(function() {
	
			// read initial values from markup and remove that
			var valueLabel = $('#'+$(this).attr('data-attr')+'TotalValue');
			
			$(this).slider({
				value: 7,
				range: "min",
				min: 0,
				max: 12,
				step: 1,
				animate: true,
				orientation: "vertical",
				slide: function( event, ui ) {
					valueLabel.text(ui.value);
				},
				change: function( event, ui ) {
					valueLabel.text(ui.value);
					$(this).attr('value',ui.value);
					form.updateAttributeTotals();
				}
			});
		});
		$('.disciplineSlider').each(function() {
		
			// read initial values from markup and remove that
			var valueLabel = $('#'+$(this).attr('data-disc')+'TotalValue');
			
			$(this).slider({
				value: 1,
				range: "min",
				min: 1,
				max: 5,
				step: 1,
				animate: true,
				orientation: "vertical",
				slide: function( event, ui ) {
					valueLabel.text(ui.value);
				},
				change: function( event, ui ) {
					valueLabel.text(ui.value);
					$(this).attr('value',ui.value);
					form.updateDisciplineTotals();
				}
			});
		});
		$('#ResetAdjustmentsButton').button();
		$('#FinalizeButton').button();
	}	
	addEvents(){
		var form = this;
		$('#CharacterCreationSpeciesSelect').change(function(){
			if(this.value != -1){
				form.updateStep("Species",species.item(this.value));
				$('#CharacterCreationSpeciesTalentsSelector').empty();
				$('#CharacterCreationEnvironmentSelect').trigger("change");
			}
		});
		$('#CharacterCreationEnvironmentSelect').change(function(){
			if(this.value != -1){
				if(this.value == 6){
					$('#CharacterCreationEnvironmentOtherSpeciesSelect').show();
				}
				else {
					$('#CharacterCreationEnvironmentOtherSpeciesSelect').hide();
				}
				form.updateStep("Environment",environments.item(this.value));
			}
		});
		$('#CharacterCreationEnvironmentOtherSpeciesSelect').change(function(){
			if(this.value != -1){
				$('#CharacterCreationEnvironmentSelect').trigger('change');
			}
		});
		$('#CharacterCreationUpbringingSelect').change(function(){
			if(this.value != -1){
				form.updateStep("Upbringing",upbringing.item(this.value));
			}
		});
		$('#CharacterCreationCareerSelect').change(function(){
			if(this.value != -1){
				form.updateStep("Career",career.item(this.value));
			}
		});
		$('#CharacterCreationStarfleetTrackSelect').change(function(){
			if(this.value != -1){
				form.updateStep("StarfleetTrack",starfleetTrack.item(this.value));
			}
		});
		$('#CharacterCreationCareerEventsSelect1').change(function(){
			if(this.value != -1){
				form.updateStep("CareerEvent1",careerEvents.item(this.value));
			}
		});
		$('#CharacterCreationCareerEventsSelect2').change(function(){
			if(this.value != -1){
				form.updateStep("CareerEvent2",careerEvents.item(this.value));
			}
		});
		$(window).resize(function() {
			if($('#NewCharacterDialog').dialog('isOpen')){
				$('#NewCharacterDialog').dialog('option','width',(window.innerWidth)*.7);
				$('#NewCharacterAccordion').accordion('option','heightStyle','content');
			}
		});
		form.updateStep("FinishingTouches",finishingTouches.data);
		$('.nudge').each(function(){
			$(this).trigger("change");
		});
		$('#ResetAdjustmentsButton').click(function(){
			form.updateValues();
			form.updateTotals();
		});
		$('#FinalizeButton').click(function(){
			console.log();
			form.finalize();
			form.close();
		});
	}
	getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min;
	}
	talentSelector(selector,target){
		
		$(selector).empty();
		
		var talentList = $.merge(species.item($('#CharacterCreationSpeciesSelect').val()).Talents,talents.data);
	
		$(talentList).each(function(key,value){
	
			//creating the div that will be moved to the NewCharacterForm
			var talentDiv = document.createElement('div');
			var talentType = "";
			var requirements = [];
			var requirementText = "";
			if(value.id){
				talentDiv.id = "TalentSelectorDiv"+value.id;
				if(value.Requirements){
					$(value.Requirements).each(function(key,value){
						requirements.push(value.Discipline + " +" + value.value);
						talentType += value.Discipline;
					})
					requirementText = requirements.join(" or ");
				}
				if(requirementText == ""){
					requirementText = value.Discipline;
				}
				requirementText = "("+requirementText+")";
			} else {
				talentDiv.id = "TalentSelectorDivSpecies"+key;
				if(value.Requirements){
					requirementText = "(Species "+value.Requirements+")";
				}
			}
			if(talentType == ""){
					talentType = value.Discipline;
			}
			talentType += "Talent";
			talentDiv.className = "talentSelectorDiv "+talentType;
			selector.appendChild(talentDiv);
	
			var talentHeader = document.createElement('span');
			talentHeader.id = "TalentHeader" + value.id;
			talentHeader.className = "talentHeader";
			talentHeader.innerHTML = value.Name + " " + requirementText;
			talentDiv.appendChild(talentHeader);
	
			var talentSpan = document.createElement('span')
			talentSpan.id = "TalentSpan" + value.id;
			talentSpan.className = "talentSpan";
			talentSpan.innerHTML = value.Description;
			talentDiv.appendChild(talentSpan);
	
			$(talentDiv).click(function(){
				$(this).addClass("chosenTalent");
				$(this).attr('data-talent',value.Name);
				$(target).empty();
				$(this).clone().appendTo(target);
				$(selector).dialog("close");
				$(selector).remove();
			});
	
		});
	
		$(selector).dialog({
			width: (window.innerWidth*.6),
			height: (window.innerHeight*.6),
			position: { my: "top center", at: "top center", of: window }
		});
	}
	populateSelect(id,variable){
		
		var form = this;
		
		$('#'+id).each(function(key,value){
	
			var select = document.getElementById(value.id);
	
			$(variable).each(function(key,value){
	
				var option = document.createElement('option');
				option.id = "Option"+value.id;
				option.value = value.id;
				option.innerText = value.Name;
				select.appendChild(option);
	
			});
	
			var option = document.createElement('option');
				option.id = "Option"+select.childNodes.length+1;
				option.value = -1;
				option.innerText = "Random";
				select.appendChild(option);
	
			$(select).change(function(){
	
				var randomValue = form.getRndInteger(1,select.childNodes.length-1);
	
				if(this.value == -1){
					console.log(randomValue);
					$(select).val(randomValue);
					$(this).trigger('change');
				}
	
			});
	
		});
	}
	populateSelects(className,variable){
		var form = this;
		$('.'+className).each(function(key,value){
			form.populateSelect(value.id, variable);
		});
	}
	updateStep(step, value){

		var form = this;
	
		//Empty and Update Any divs
		$('#CharacterCreation'+step+'Description').text(value.Description);
		$('#CharacterCreation'+step+'Era').text(value.Era);
		$('#CharacterCreation'+step+'Choice').empty();
		$('#CharacterCreation'+step+'Attributes').empty();
		$('#CharacterCreation'+step+'Disciplines').empty();
		$('#CharacterCreation'+step+'Talents').empty();
		$('#CharacterCreation'+step+'Traits').empty();
		$('#CharacterCreation'+step+'Image').attr("src",value.Image);
	
		//Containers
		var attributeOptions = document.getElementById('CharacterCreation'+step+'Attributes');
		var disciplineOptions = document.getElementById('CharacterCreation'+step+'Disciplines');
		var talentOptions = document.getElementById('CharacterCreation'+step+'Talents');
		var traits = document.getElementById('CharacterCreation'+step+'Traits');
		var choiceOptions = document.getElementById('CharacterCreation'+step+'Choice');
	
		$(value.Actions).each(function(key,value){
	
			var repeat = value.Repeat || 0;
	
			switch(value.Action){
	
				case "AddAttribute":
	
					var colWidth = 12/value.Options.length;
	
					$(value.Options).each(function(key,value){
	
							var attributevalue = value.Value || 1;
	
							var attribute = document.createElement('div');
							attribute.className = "col-xs-"+colWidth;
							attributeOptions.appendChild(attribute);
	
							var attributeSpan = document.createElement('span');
							attributeSpan.innerText = value.Attribute + " +" + attributevalue;
	
							if(step.indexOf("Choice") == -1){
									attributeSpan.className = "chosenAttribute attribute";
							}
							else {
									attributeSpan.className = "attribute";
							}
	
							attributeSpan.dataset.value = attributevalue;
							attributeSpan.dataset.attribute = value.Attribute;
							attribute.appendChild(attributeSpan);
	
					});
				break;
				case "AddDiscipline":
	
					var colWidth = 12/value.Options.length;
	
					$(value.Options).each(function(key,value){
	
						var disciplineValue = value.Value || 1;
						
						var discipline = document.createElement('div');
						discipline.className = "col-xs-"+colWidth;
						disciplineOptions.appendChild(discipline);
						
						var disciplineSpan = document.createElement('span');
						disciplineSpan.innerText = value.Discipline + " +" + disciplineValue;
						
						if(step.indexOf("Choice") == -1){
							disciplineSpan.className = "chosenDiscipline discipline";
						}
						else {
							disciplineSpan.className = "discipline";
						}
						
						disciplineSpan.dataset.value = disciplineValue;
						disciplineSpan.dataset.discipline = value.Discipline;
						discipline.appendChild(disciplineSpan);
	
					});
				break;
				case "AddFocus":
	
					for(var i = 0; i<repeat+1; i++){
	
						if(!$('#CharacterCreation'+step+'FocusInput'+(i+1)).length){
							console.log("No placeholder for "+'CharacterCreation'+step+'FocusInput'+(i+1)+" Found")
						}
	
					}
	
				break;
				case "AddTalent":
	
					for(i = 0; i<repeat+1; i++){
	
						$(value.Options).each(function(key,value){
	
							var talentDiv = document.createElement('div');
							talentDiv.id = "TalentSelectorDiv"+value.id;
							talentDiv.className = value.Discipline + "Talent talentSelectorDiv chosenTalent";
							talentDiv.dataset.talent = value.Name;
							talentOptions.appendChild(talentDiv);
	
							var talentHeader = document.createElement('span');
							talentHeader.id = "TalentHeader" + value.id;
							talentHeader.className = "talentHeader";
							talentHeader.innerHTML = value.Name;
							talentDiv.appendChild(talentHeader);
	
							var talentSpan = document.createElement('span')
							talentSpan.id = "TalentSpan" + value.id;
							talentSpan.className = "talentSpan";
							talentSpan.innerHTML = value.Description;
							talentDiv.appendChild(talentSpan);
	
						});
	
					}
	
				break;
				case "AddTrait":
	
					$(value.Options).each(function(key,value){
						var trait = document.createElement('p');
						trait.id = step + "_" + value.Trait;
						trait.innerText = value.Trait;
						traits.appendChild(trait);
	
						trait.innerText = species.item(value.Trait).Trait;
	
					});
				break;
				case "AddValue":
	
					for(i = 0; i<repeat+1; i++){
	
						if(!$('#CharacterCreation'+step+'ValueInput'+(i+1)).length){
							console.log("No placeholder for "+'CharacterCreation'+step+'ValueInput'+(i+1)+" Found")
						}
	
					}
	
				break;
				case "Choose":
	
					var upbringingChoiceRow = document.createElement('div');
					upbringingChoiceRow.className = "row";
					choiceOptions.appendChild(upbringingChoiceRow);
	
					$(value.Options).each(function(key,value){
	
						var choiceDiv = document.createElement('div');
						choiceDiv.id = "CharacterCreation" + step + "choice" + value.Choice;
						choiceDiv.className = "col-xs-6 center " + value.Choice +"Choice";
						upbringingChoiceRow.appendChild(choiceDiv);
	
						var choiceLabel = document.createElement('label');
						choiceLabel.id = step +"Label" + value.Choice;
						choiceLabel.innerHTML = value.Choice;
						choiceDiv.appendChild(choiceLabel);
	
						var choiceInput = document.createElement('input');
						choiceInput.type = "radio";
						choiceInput.name = "UpbringingAcceptReject";
						choiceLabel.appendChild(choiceInput);
	
						var choiceDivAttributes = document.createElement('div');
						choiceDivAttributes.id = "CharacterCreation" + step + "Choice" + value.Choice + "Attributes";
						choiceDivAttributes.className = "center "+ step + "Choice";
						choiceDiv.appendChild(choiceDivAttributes);
	
						var choiceDivDisciplines = document.createElement('div');
						choiceDivDisciplines.id = "CharacterCreation" + step + "Choice" + value.Choice + "Disciplines";
						choiceDivDisciplines.className = "center "+ step + "Choice";
						choiceDiv.appendChild(choiceDivDisciplines);
	
						form.updateStep(step+"Choice"+value.Choice,value);
	
						$(choiceInput).checkboxradio({
							icon: false
						});
	
						$(choiceLabel).change(function(){
	
							$('.'+step+"Choice").each(function(key,value){
								
								$(value).find('.attribute').each(function(key,value){
									$(value).removeClass('chosenAttribute');
								});
	
								$(value).find('.discipline').each(function(key,value){
									$(value).removeClass('chosenDiscipline');
								});
	
							});
	
							if($(this).hasClass('ui-checkboxradio-checked')){
	
								$(choiceDivAttributes).find('.attribute').each(function(key,value){
									$(this).addClass('chosenAttribute');
								});
	
								$(choiceDivDisciplines).find('.discipline').each(function(key,value){
									$(this).addClass('chosenDiscipline');
								});
							}
	
						});
	
					});
	
				break;
				case "ChooseTalent":
	
					for(i = 0; i<repeat+1; i++){
	
						var chooseTalent = document.createElement('div');
						chooseTalent.id = 'CharacterCreation'+step+'TalentsChooseTalent'+i;
						chooseTalent.className = 'chooseTalentDiv';
						chooseTalent.innerHTML = 'Choose a Talent';
						talentOptions.appendChild(chooseTalent);
	
						var selectedTalent = document.createElement('div');
						selectedTalent.id  = 'CharacterCreation'+step+'SelectedTalent'+i;
						talentOptions.appendChild(selectedTalent);
	
						var talentSelector = document.createElement('div');
						talentSelector.id  = 'CharacterCreation'+step+'TalentSelector'+i;
						talentSelector.title = 'Choose a Talent';
						talentOptions.appendChild(talentSelector);
	
						$(chooseTalent).click(function(){
	
							form.talentSelector(talentSelector,selectedTalent);
	
						});
	
					}
	
				break;
				case "ChooseAttribute":
	
					//get list of options for attributes
					var options = [];
	
					$(value.Options).each(function(key,value){
	
						switch(value.Attribute){
	
							case "Any":
								$(attributes.data).each(function(key,value){
									options.push(value.Name);
								})
							break;
							case "SpeciesAttributes":
							case "ChooseAnySpeciesAttributes":
	
								if(value.Attribute == "SpeciesAttributes"){
									var selectedSpecies = species.item($('#CharacterCreationSpeciesSelect').val());
								}
								else {
									var selectedSpecies = species.item($('#CharacterCreationEnvironmentOtherSpeciesSelect').val());
								}
	
								$(selectedSpecies.Actions).each(function(key,value){
	
									switch(value.Action){
	
										case "AddAttribute":
										case "ChooseAttribute":
											$(value.Options).each(function(key,value){
												if(value.Attribute == "Any"){
													$(attributes).each(function(key,value){
														options.push(value.Name);
													})
												}
												else {
													options.push(value.Attribute);
												}
											});
										break;
									}
	
								})
							break;
							default:
								options.push(value.Attribute);
							break;
						}
	
					});
	
					var attributeValue = value.Value || 1;
	
					if(value.Description){
	
							var attributeDescription = document.createElement('div');
							attributeDescription.className = "col-xs-12 attributeDescription";
							attributeDescription.innerHTML = value.Description;
							attributeOptions.appendChild(attributeDescription);
	
					}
	
					//create the attribute selector
					for(i = 0; i<repeat+1; i++){
	
						var attributeRow = document.createElement('div');
						attributeRow.id = step+"AttributeRow"+i;
						attributeRow.className = "row";
						attributeOptions.appendChild(attributeRow);
	
						var colWidth = 12/options.length;
						var maxValue = value.MaxValue || 1;
	
						$(options).each(function(key,value){
	
							var attribute = document.createElement('div');
							attribute.className = "col-xs-"+colWidth+" center";
							attributeRow.appendChild(attribute);
	
							var attributeLabel = document.createElement('label');
							attributeLabel.innerText = value;
							attributeLabel.className = "formRadioButtonLabel attributeButton creation"+step+"ChooseAttribute"+value;
							attributeLabel.dataset.value = attributeValue;
							attributeLabel.dataset.attribute = value;
							attribute.appendChild(attributeLabel);
	
							var attributeInput = document.createElement('input');
							attributeInput.type = "radio";
							attributeInput.name = "Creation"+step+"attribute"+i;
							attributeInput.dataset.attribute = value;
							attributeInput.id = step+"Attribute"+i+value;
							attributeLabel.appendChild(attributeInput);
	
							$(attributeInput).checkboxradio({
								icon: false
							});
	
							$(attributeLabel).mousedown(function(e){
								if($('.creation'+step+'ChooseAttribute'+value+'.ui-checkboxradio-checked').length >= maxValue){
									alert("You have chosen "+$(attributeInput).data('attribute')+" more than the maximum of "+maxValue+" for this attribute at this step");
									e.stopImmediatePropagation();
								}
							});
	
						});
					}
	
				break;
				case "ChooseDiscipline":
				
					var options = []
	
					$(value.Options).each(function(key,value){
						if(value.Discipline == "Any"){
							$(disciplines.data).each(function(key,value){
								options.push(value.Name);
							})
						}
						else {
							options.push(value.Discipline);
						}
	
					});
	
					var colWidth = 6;
	
					if(options.length > 2){
						colWidth = 12/options.length;
					}
	
					if(value.Description){
	
						var disciplineDescription = document.createElement('div');
						disciplineDescription.className = "col-xs-12 disciplineDescription";
						disciplineDescription.innerHTML = value.Description;
						disciplineOptions.appendChild(disciplineDescription);
	
					}
	
					var disciplineValue = value.Value || 1;
					var degree = value.Degree || "";
					var maxValue = value.MaxValue || 1;
	
					for(i = 0; i<repeat+1; i++){
	
						var disciplineRow = document.createElement('div');
						disciplineRow.id = step+"disciplineRow"+i;
						disciplineRow.className = "row";
						disciplineOptions.appendChild(disciplineRow);
	
						$(options).each(function(key,value){
	
								var discipline = document.createElement('div');
								discipline.className = "col-xs-"+colWidth+" center";
								disciplineRow.appendChild(discipline);
	
								var disciplineLabel = document.createElement('label');
								disciplineLabel.innerText = value;
								disciplineLabel.dataset.discipline = value;
								disciplineLabel.dataset.value = disciplineValue;
								disciplineLabel.className = "formRadioButtonLabel disciplineButton creation"+step+"ChooseDiscipline"+value;
								discipline.appendChild(disciplineLabel);
	
								var disciplineInput = document.createElement('input');
								disciplineInput.type = "radio";
								disciplineInput.name = "Creation"+step+"Discipline"+i+degree;
								disciplineInput.id = step+"Discipline"+i+value+degree;
								disciplineLabel.appendChild(disciplineInput);
	
								$(disciplineInput).checkboxradio({
									icon: false
								});
	
								$(disciplineLabel).mousedown(function(e){
									if($('.creation'+step+'ChooseDiscipline'+value+'.ui-checkboxradio-checked').length >= maxValue){
										alert("You have chosen to many values for this discipline at this step");
										e.stopImmediatePropagation();
									}
								});
	
							});
					}
				break;
				default:
					console.log("Uncaught Action " + value.Action);
				break;
			}
	
		});
	}
	updateAttributeValues(){
		
		var attributeTotals = [];
		var attributeCap = 12;
		
		if($('.chosenTalent[data-talent="Untapped Potential"]').length>0){
			
			attributeCap = 11;
			console.log('Untapped Potential Found, setting Attribute Cap to ' + attributeCap)
			
		}
	
		$(attributes.data).each(function(key,value){
	
			attributeTotals[value.Name] = 7;
	
		});
	
		$('.chosenAttribute').each(function(key,value){
	
			attributeTotals[$(this).data('attribute')] += $(this).data('value');
	
		});
		
		$('.attributeButton.ui-checkboxradio-checked').each(function(key,value){
	
			attributeTotals[$(this).data('attribute')] += $(this).data('value');
	
		});
		
		
		
		for(var prop in attributeTotals){
			
			var totalValueDiv = $('#'+prop+'TotalValue');
			var slider = $('#'+prop+'Slider');
		
			if(attributeTotals[prop] <= attributeCap){
				slider.slider('value',attributeTotals[prop]);
			} else {
				alert(prop + ' has value of ' + attributeTotals[prop] + ' exceeded threshold of ' + attributeCap + ' lowering to cap');
				slider.slider('value',attributeCap);
			}
				
		}
		
		
	}
	updateAttributeTotals(){
		var total = 0;
				
		$('.attributeSlider').each(function(key,value){
			total += parseInt($(value).attr('value'));
		});
		$('#AttributeSlidersHeader').text('Attributes ('+ total + '/56)').attr('value',total);
		
		this.validate();
	}
	updateDisciplineValues(){
		
		var disciplineTotals = [];
		var disciplineCap = 5;
		
		if($('.chosenTalent[data-talent="Untapped Potential"]').length>0){
			
			disciplineCap = 4;
			console.log('Untapped Potential Found, setting discpiline Cap to ' + disciplineCap)
			
		}

		$(disciplines.data).each(function(key,value){
	
			disciplineTotals[value.Name] = 1;
	
		})
	
	
		$('.chosenDiscipline').each(function(key,value){
	
			disciplineTotals[$(this).data('discipline')] += $(this).data('value');
	
		});
	
		$('.disciplineButton.ui-checkboxradio-checked').each(function(key,value){
	
			disciplineTotals[$(this).data('discipline')] += $(this).data('value');
		});
	
		var total = 0;
	
		for(var prop in disciplineTotals){
		
			var totalValueDiv = $('#'+prop+'TotalValue');
			var slider = $('#'+prop+'Slider');

			if(disciplineTotals[prop] <= disciplineCap){
				slider.slider('value',disciplineTotals[prop]);
			} else {
				alert(prop + ' has value of ' + disciplineTotals[prop] + ' exceeded threshold of ' + disciplineCap + ' lowering to cap');
				slider.slider('value',disciplineCap);
			}

		}

	}
	updateDisciplineTotals(){
		var total = 0;
		
		$('#FinalizeButton').button('option','disabled', false);
		$('.disciplineSlider').each(function(key,value){
			total += parseInt($(value).attr('value'));
		});
		$('#DisciplineSlidersHeader').text('Discipline ('+ total + '/16)').attr('value',total);
		
		this.validate();
	}
	updateValues(){
		this.updateAttributeValues();
		this.updateDisciplineValues();
	}
	updateTotals(){
		this.updateAttributeTotals();
		this.updateDisciplineTotals();
	}
	updateTextValues(){
		var form = this;
		$('#FocusAdjustContainer,#ValueAdjustContainer,#TalentAdjustContainer').empty();
		$('.chosenFocus').each(function(key,value){
			
			var focusAdjustContainer = document.getElementById('FocusAdjustContainer');
			
			var finalFocusDiv = document.createElement('div');
			finalFocusDiv.id = 'FinalFocusDiv'+key;
			finalFocusDiv.className = 'col-xs-12';
			focusAdjustContainer.appendChild(finalFocusDiv);
			
			var finalFocusInput = document.createElement('input');
			finalFocusInput.id = 'FinalFocus'+key;
			finalFocusInput.className = 'finalFocusInput formTextInput';
			finalFocusInput.value = value.value;
			finalFocusInput.addEventListener('click',function(){
				form.validate();
			});
			finalFocusDiv.appendChild(finalFocusInput);
		});	
		$('.chosenValue').each(function(key,value){
			
			var valueAdjustContainer = document.getElementById('ValueAdjustContainer');
			
			var finalValueDiv = document.createElement('div');
			finalValueDiv.id = 'FinalValueDiv'+key;
			finalValueDiv.className = 'col-xs-12';
			valueAdjustContainer.appendChild(finalValueDiv);
			
			var finalValueInput = document.createElement('input');
			finalValueInput.id = 'FinalValue'+key;
			finalValueInput.className = 'finalValueInput formTextInput';
			finalValueInput.value = value.value;
			finalValueInput.addEventListener('click',function(){
				form.validate();
			});
			finalValueDiv.appendChild(finalValueInput);

		})
		$('.chosenTalent').each(function(key,value){
			
			var talentAdjustContainer = document.getElementById('TalentAdjustContainer');			
			var finalTalent = $(value).clone(true).appendTo(talentAdjustContainer);
			$(finalTalent).addClass('finalChosenTalent').removeClass('chosenTalent')
			
		})
	}
	updateAdjustments(){
		this.updateValues();
		this.updateTotals();
		this.updateTextValues();
	}
	validate(){
		$('#FinalizeButton').button('option','disabled', false);
		
		if($('#AttributeSlidersHeader').attr('value') != 56 || $('#DisciplineSlidersHeader').attr('value') != 16){
			$('#FinalizeButton').button('option','disabled', true);
		}
		
		$('.finalFocusInput,.finalValueInput').each(function(key,value){
			if(value.value == ''){
				$('#FinalizeButton').button('option','disabled', true);
			}
		});
	}
	finalize(){
	
		$('.attributeFinalValue').each(function(key,value){
			
			var attribute = $(value).attr('data-attr');

			$('#'+attribute+'Value').attr('value',value.innerText);
		})
		
		$('.disciplineFinalValue').each(function(key,value){
			
			var discipline = $(value).attr('data-disc');
			
			$('#'+discipline+'Value').attr('value',value.innerText);
			
		})
		
		$('.finalFocusInput').each(function(key,value){
			
			$('#Focus'+key).attr('value',value.value);
			
		})
		
		$('.finalValueInput').each(function(key,value){
			
			$('#Value'+key).attr('value',value.value);
			
		})
		
		$('.finalChosenTalent').each(function(key,value){
			
			$('#Talent'+key).attr('value',value.dataset.talent);
			
		})
		
	}
	open(){
		$('#NewCharacterDialog').dialog("open");
	}
	close() {
		$('#NewCharacterDialog').dialog("close");
	}
}
class OptionsMenu {
	constructor(){
		var form = this;
		console.log('Starting OptionsMenu');
		if(document.readyState === "complete"){
			form.createForm();
			form.updateView();
			form.addEvents();
		} else {
			 window.addEventListener('load',function(){
				form.createForm();
				form.updateView();
				form.addEvents();
			});
		}
		this.close();
	}
	createForm(){
		$('div[aria-describedby="OptionsDialog"]').remove();
		$('#OptionsMenu').remove();
		
		var optionsMenu = document.createElement('div');
		optionsMenu.id = 'OptionsMenu';
		document.body.appendChild(optionsMenu);
		optionsMenu.innerHTML = document.getElementById('OptionsMenuTemplate').innerHTML;
	}
	updateView(){
		$('#OptionsDialog').dialog({
			width: (window.innerWidth)*.7,
			position: { my: "center", at: "center", of: document },
			resize: function() {
				$( "#OptionsDialog" ).accordion( "refresh" );
			}
		});
		$('#OptionsAccordion').accordion({
			heightStyle: "content"
		});
	}
	addEvents(){
		var form = this;
		$('#ConfigIconContainer').click(function(){
			optionsMenu.open();
		});
		$(window).resize(function(){
			if($('#OptionsDialog').dialog('isOpen')){
				form.updateView();
			}
		});
		$('.themeSetting').change(function(){
			if(this.value == "Dark"){
		
				$('html').css('--bgColor','#001422');
				$('html').css('--fgColor','#FFFFFF');
				$('html').css('--inputBGColor','#001422');
				$('html').css('--borderColor','#082d47');
				$('html').css('--dialogBorderColor','#001422');
				$('html').css('--dialogInactiveColor','#9676a9');
				$('html').css('--dialogActiveColor','#f59d08');
				$('.monoChromeInvert').css('filter','invert(100%)');
			}
			else if (this.value == "Light") {
		
				$('html').css('--bgColor','#FFFFFF');
				$('html').css('--fgColor','#000000');
				$('html').css('--inputBGColor','#FFFFFF');
				$('html').css('--borderColor','#eeeeee');
				$('html').css('--dialogBorderColor','#eeeeee');
				$('html').css('--dialogInactiveColor','#c3bcde');
				$('html').css('--dialogActiveColor','#f59d08');
				$('.monoChromeInvert').css('filter','invert(0%)');
		
			}
		});
		$('.themeSetting:checked').trigger('change');
	}
	open(){
		$('#OptionsDialog').dialog("open");
	}
	close() {
		$('#OptionsDialog').dialog("close");
	}
}
class CharacterForm {
	constructor(){
		console.log('Starting CharacterForm');
		//give it a nudge
		this.addEvents();
		this.populateSelects('speciesSelect',species.data);
		this.populateSelects('environmentSelect',environments.data);
		this.populateSelects('upbringingSelect',upbringing.data);
		$('#FitnessValue').trigger('change');
	}
	AddArcMileStone(){



	}
	addEvents(){
		$('.lcarsUpperLeft').click(function(){
			communicator.play();
		})
		$('.stressCheckBox').change(function(){

			var currentValue = parseInt(document.getElementById(this.id).dataset.value);

			$('.stressCheckBox').each(function(key,value){

				if(parseInt(document.getElementById(value.id).dataset.value) <= currentValue){

					document.getElementById(value.id).checked = true;

				} else {

					document.getElementById(value.id).checked = false;
				}

			});

		});
		$('.attributeValue').change(function(){

			//check if player has exceeded maximum attributes
			var attributeCount = 0;

			$('.attributeValue').each(function(key,value){

				attributeCount += parseInt(value.value)

			});

		});
		$('#FitnessValue,#SecurityValue').change(function(){
			
			var stress = parseInt(document.getElementById('FitnessValue').value)+parseInt(document.getElementById('SecurityValue').value);

			$('.stressCheckBox').each(function(key,value){

				if(parseInt($('#'+value.id).attr('data-value')) <= stress){

					document.getElementById(value.id).disabled = false;

				}
				else {

					document.getElementById(value.id).disabled = true;

				}

			});
			
		});
		$('.disciplineValue').change(function(){

			//check if player has exceeded maximum disciplines
			var disciplineCount = 0;

			$('.disciplineValue').each(function(key,value){

				disciplineCount += parseInt(value.value)

			});

			CalculateStress();

		});
		$('#AddArcMileStone').click(function(){
			if(confirm("Would you like to add a new Arc Milestone?")){
				AddArcMileStone();
			} else {
				alert("Too bad, you had potential...");
			}
		});
		$('.arcMileStone').click(function(){
			RemoveArcMileStone(this);
		});
		$('#AddSpotLightMileStone').click(function(){
			if(confirm("Would you like to add a new Spotlight Milestone?")){
				AddArcMileStone();
			} else {
				alert("Why'd you push me then?");
			}
		});
		$('.arcMileStone').click(function(){
			RemoveArcMileStone(this);
		});
	}
	getRndInteger(min, max) {
		return Math.floor(Math.random() * (max - min) ) + min;
	}
	populateSelect(id,variable){
		var form = this;
		$('#'+id).each(function(key,value){
	
			var select = document.getElementById(value.id);
	
			$(variable).each(function(key,value){
	
				var option = document.createElement('option');
				option.id = "Option"+value.id;
				option.value = value.id;
				option.innerText = value.Name;
				select.appendChild(option);
	
			});
	
			var option = document.createElement('option');
				option.id = "Option"+select.childNodes.length+1;
				option.value = -1;
				option.innerText = "Random";
				select.appendChild(option);
	
			$(select).change(function(){
	
				var randomValue = form.getRndInteger(1,select.childNodes.length-1);
	
				if(this.value == -1){
					console.log(randomValue);
					$(select).val(randomValue);
					$(this).trigger('change');
				}
	
			});
	
		});
	}
	populateSelects(className,variable){
		var form = this;
		$('.'+className).each(function(key,value){

			form.populateSelect(value.id, variable);
		});
	}
}
//Load Resources
var communicator = new Audio('data:audio/x-wav;base64, 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');
var species = new JsonData("Resources/species.json","speciesData");
var environments = new JsonData("Resources/environments.json","environmentsData");
var upbringing = new JsonData("Resources/upbringing.json","upbringingData");
var starfleetTrack = new JsonData("Resources/starfleetTrack.json","starfleetTrackData");
var career = new JsonData("Resources/career.json","careerData");
var careerEvents = new JsonData("Resources/careerEvents.json","careerEventsData");
var finishingTouches = new JsonData("Resources/finishingTouches.json","finishingTouchesData");
var talents = new JsonData("Resources/talents.json","talentsData");
var weapons = new JsonData("Resources/weapons.json","weaponsData");
var attributes = new JsonData("Resources/attributes.json","attributesData");
var disciplines = new JsonData("Resources/disciplines.json","disciplinesData");

//Reset Window to Top of Screen
$('html, body').animate({scrollTop : 0},800);

//Add in FormObjects
var optionsMenu = new OptionsMenu();
var characterForm = new CharacterForm();
var characterCreationForm = new CharacterCreationForm();
