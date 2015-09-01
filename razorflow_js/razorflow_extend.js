function razo() {
    var dbAsJson = null;
    var current_key = null;
    var data_changed = false;
    var map = null;
    var LeafIcon = null ;
    var marker = null ;
    var selected_icon = null ;
    var setting_icon_press = false ;
    var setting_widget_add = "add";
    var filter_date_first = ( new Date().getMonth()+1)+"-"+( new Date().getDate()-1)+"-"+new Date().getFullYear();
    var filter_date_second = null;
    var active_filter_tab = null;
    var is_used_multi = "";
            }         
razo.prototype = new  rf.StandaloneBuilder();
razo.prototype.buildDashboardFromObject = function() {
                rf.StandaloneBuilder.call(this);
                console.log('begining ...... ');
               
                this.renderMap();
                this.buildDashboardFromObject(this.dbAsJson);
                this.registerIconClicks();
              
 
                                
}
razo.prototype.beginMap = function()
{
         
     var map = L.map('map').setView([51.505, -0.09], 8);

     L.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
			maxZoom: 18,
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
				'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
				'Imagery � <a href="http://mapbox.com">Mapbox</a>',
			id: 'examples.map-i875mjb7'
		}).addTo(map);
                
      	var LeafIcon = L.Icon.extend({
			options: {
				
				iconSize:     [32, 32],
				iconAnchor:   [22, 94],
				popupAnchor:  [-3, -76]
			}
		});
          
                
      return [map , LeafIcon];      
    
}
razo.prototype.renderMap = function()
{
      
       if(typeof this.map != "undefined")
        {
            var map_data  = this.beginMap();
            this.map = map_data[0];
            this.LeafIcon = map_data[1];
           
        }
    
}
razo.prototype.installForms = function()
{
   var lang_html = $("#langages_div").html();
   $(lang_html).insertBefore(".add-widget-btn"); 
   var filter_data_form  = $("#filter_date_div").html();
   $(filter_data_form).insertBefore(".rfDashboardCore"); 
 
   
}
razo.prototype.installActiveTabs = function()
{
   
    if(rf.globals.builder.active_filter_tab  != null)
    {
        
        for(var i=0;i<6;i++)
        {
            if(rf.globals.builder.active_filter_tab == "time_"+i)
            {
                $("#"+this.active_filter_tab).addClass("active");
                 data_group = this.DateCalculations($("#"+rf.globals.builder.active_filter_tab).text());
            }
            else
            {
                $("#time_"+i).removeClass("active");
            }
             
        }
        
      
    }
    
    
}

razo.prototype.registerIconClicks = function()
{
       var that = this;
       that.setting_icon_press = false;
    
      $(document).ready(function() {
            
               
                that.installForms();               
                that.initopacity();
                $("#date-from").datepicker();
                $("#date-to").datepicker();
                $("#s_id").val(0);
               // $(".list").sortable();
                $("body").on("click", ".pie-chart" ,function(e){    that.selected_icon = "circle";  rf.globals.builder.renderPieClick(e , $(this) , that);    }); 
                $("body").on("click", ".line-chart" ,  function(e){    that.selected_icon = "line";  rf.globals.builder.renderPieClick(e, $(this)  , that)});
                $("body").on("click",  ".vertical-bar-chart" , function(e){    that.selected_icon = "vbar";  rf.globals.builder.renderPieClick(e , $(this) , that)});
                $("body").on("click", ".vertical-stacked-bar-chart" ,  function(e){  that.selected_icon = "vsbar"; rf.globals.builder.renderPieClick(e , $(this) , that )});
                $("body").on("click",  ".horizontal-bar-chart" , function(e){  that.selected_icon = "hbar"; rf.globals.builder.renderPieClick(e , $(this) , that )});
                $("body").on("click", ".rfTableBody tr" , function(e){     
                    rf.globals.builder.renderTableClick(e ,  $(this)  );
                 });
                 
                $("body").on("click", ".remove" , function(e){     
                    rf.globals.builder.removeClickableComponent(e ,  $(this) );
                 }); 

                 $("body").on("click", ".settings , .add-widget-btn"  , function(e){     
                         
                           if($(e.target).attr("class") == 'add-widget-btn')
                           {
                               that.setting_widget_add = "add";
                               $("#simple_object_data").val("default");
                               $("#simple_show_object").val(10);
                               $("#simple_is_pass_zeroth").attr('checked', true);
                               $("#simple_show_object").prop('disabled', false);
                               $("#simple_is_pass_zeroth").prop('disabled', false);
                               $('.select-simple-graph-server-type-wrapper').find(".select-server-type").each(function() {
                                     $(this).removeClass("active");
                                });
                             
                               
                                that.ResetForm();
                           }
                           else
                           {
                                that.setting_widget_add = "edit";
                                    
                                  
                                    // get id of widget and assign it to form hidden field
                                    var id =  that.getWidgetId($("#"+$(e.target).attr("id")).parent().find(".widget_hidden").val());
                                    $("#s_id").val(id);
                                    // get widget data from db 
                                   that.ResetForm();
                                  
                                    rf.globals.builder.ajaxRequest.ajax({
                                        url: edit_path,
                                        type : "POST" ,
                                        data : {w_id : id},
                                        success: function(data) {

                                            var return_data =  JSON.parse(data);
                                            
                                           
                                            if(return_data.chart_type == "simple")
                                            {
                                                $('.select-simple-graph-server-type-wrapper').find(".select-server-type").each(function() {
                       
                                                            if(return_data.block_query_id_val == $(this).attr('data-server-type'))
                                                            {
                                                                $(this).addClass("active"); 
                                                                $("#block_val").val(return_data.block_query_id);
                                                                if($(this).hasClass("select-sub-widgets"))
                                                                {
                                                                    $(".sub-widgets-popup").show();
                                                                }
                                                            }
                                                            else
                                                            {
                                                                $(this).removeClass("active");
                                                            }

                                                        });
                                                        
                                                       $("#multi-graph-tabs").hide();    
                                                       $("#simple-graph-tabs").show();  
                                                        if(return_data.obj_id == 0)
                                                        {
                                                            $("#simple_object_data").val("default");
                                                            $("#simple_show_object").prop('disabled', false);
                                                            $("#simple_is_pass_zeroth").prop('disabled', false);
                                                        }
                                                        else
                                                        {
                                                            $("#simple_object_data").val(return_data.obj_id);
                                                            $("#simple_show_object").prop('disabled', true);
                                                            $("#simple_is_pass_zeroth").prop('disabled', true);
                                                        }
                                                        $("#simple_show_object").val(return_data.objects_num);
                                                        var checked = return_data.skip_zero == 0?false:true;
                                                        $("#simple_is_pass_zeroth").attr('checked', checked);

                                                        $("#graph-types").children().each(function () 
                                                        {


                                                             if($(this).attr("data-graph-type") == "simple-graph")
                                                             {
                                                                   $(this).addClass("active");
                                                             }
                                                             else
                                                             {
                                                                 $(this).removeClass("active");
                                                             } 

                                                        });   
                                                  
                                                        
                                                           
                                                        
                                                  }
                                                  else
                                                  {
                                                      // assign multi to form 
                                                       if(return_data.obj_id == 0)
                                                        {
                                                            $("#multi_object_data").val("default");
                                                            $("#multi_is_pass_zeroth").prop('disabled', false);
                                                        }
                                                        else
                                                        {
                                                            $("#multi_object_data").val(return_data.obj_id);
                                                            $("#multi_is_pass_zeroth").prop('disabled', true);
                                                        }
                                                      
                                                       var checked = return_data.skip_zero == 0?false:true;
                                                       $("#multi_is_pass_zeroth").attr('checked', checked);
                                                      
                                                      
                                                      $("#multi_block_val").val(return_data.multi_block_val);
                                                      $("#multi_block_val2").val(return_data.multi_block_val2);
                                                     
                                                    
                                                      
                                                      $("#chart_typess").val("multi-graph");

                                                      var circle_val = return_data.avg_total == 0?"Average":"Total";
                                                      $(".filter_circle").val(circle_val);
                    
                                                      
                                                      $("#graph-types").children().each(function () 
                                                        {


                                                             if($(this).attr("data-graph-type") == "multi-graph")
                                                             {
                                                                   $(this).addClass("active");
                                                             }
                                                             else
                                                             {
                                                                 $(this).removeClass("active");
                                                             } 

                                                        }); 

                                                 
                                                     
                                                       $("#multi-graph-tabs").show();    
                                                       $("#simple-graph-tabs").hide();    
                                                       var i = 0;
                                                       var splite_query = return_data.block_query_id_val1.split("/");
                                                       var splie_data = "";
                                                       
                                                       $("#first-multi-graph-tab").html(splite_query[0].trim());
                                                       $("#second-multi-graph-tab").html(splite_query[1].trim());
                                                       $('.multi-graph-layout').find(".select-server-type").each(function() {
                       
                                                           if(i <= 8)   // first one 
                                                           {
                                                               splie_data = splite_query[0].trim();
                                                           }
                                                           else   // second one 
                                                           {
                                                                splie_data = splite_query[1].trim();
                                                           }
                                                           
                                                           
                                                       
                                              
                                                           if(splie_data == $(this).attr('data-server-type'))
                                                            {
                                                                $(this).addClass("active"); 
                                                                if($(this).hasClass("select-sub-widgets"))
                                                                {
                                                                    $(".sub-widgets-popup").show();
                                                                }
                                                            }
                                                            else
                                                            {
                                                                $(this).removeClass("active");
                                                            }
                                                            
                                                            i++;
                                                  
                                                        });
                                                        
                                                        
                                                        $(".av-total-wrapper").find('.circle').each(function () {
                     
                                                             
                                                            if($.trim($(this).parent(".left").text()) == circle_val)
                                                            {
                                                                $(this).addClass("active");
                                                            }
                                                            else
                                                            {
                                                                $(this).removeClass("active");
                                                            }
                     
                                                            
                                                   });
                                                        
                                                        
                                                        
                                                        
                                                        
                                                      
                                                  }


                                              }
                                      });
                                  
                           }  
                           
                          $('#basicModal').modal();  
                 
                 }); 
                 
                 $("body").on("click", "#graph-types" , function(e){     
                        
                        var target_data = $(e.target).attr("data-graph-type");
                        $(".sub-widgets-popup").hide();
                        $(this).children().each(function () {
                            
                 
                               if($(this).attr("data-graph-type") == target_data)
                               {
                                     $(this).addClass("active");
                               }
                               else
                               {
                                   $(this).removeClass("active");
                               } 
                                                 
                                $("#chart_typess").val(target_data);
                            
                            
                            }); 
               
                        $('.modal-body').children().each(function () {
                            if($(this).attr("id") == target_data+"-tabs")
                            {
                                   $("#"+target_data+"-tabs").show(); 
                            }
                            else
                            {
                                   $("#"+$(this).attr("id")).hide();
                                  
                            }
                            
                              
                         });
                        
                 }); 
                
                 $("body").on("click", ".select-server-type" , function(e){ 
                     
                    var that = $(this);
                    var select_server = that.attr('data-server-type');
                   
                    $('.select-simple-graph-server-type-wrapper').find(".select-server-type").each(function() {
                        
                 
                            if(select_server == $(this).attr('data-server-type'))
                            {
                                $(this).addClass("active"); 
                                $("#block_val").val($(this).attr('data-server-data'));
                                if($(this).hasClass("select-sub-widgets"))
                                {
                                    $(".sub-widgets-popup").show();
                                }
                            }
                            else
                            {
                                $(this).removeClass("active");
                            }
                        
                      });
                      
                     if(that.parent().parent().parent().parent().attr("class") == "multi-graph-layout")
                     {
                                           
                         $('#'+that.parent().parent().parent().parent().attr("id")).find(".select-server-type").each(function() {
                        
                         
                            if(select_server == $(this).attr('data-server-type'))
                            {
                                $(this).addClass("active");
                                $( '#'+that.parent().parent().parent().parent().attr("id")+" .multi_block_val").val($(this).attr('data-server-data'));
                                
                                var replace_txt =  that.parent().parent().parent().parent().attr("id").replace("layout", "tab");
                             
                                $("#"+replace_txt).text($(this).text());
                               
                                if($(this).hasClass("select-sub-widgets"))
                                {
                                    $(".sub-widgets-popup").show();
                                }
                            }
                            else
                            {
                                $(this).removeClass("active");
                            }
                        
                      });
                        
                        
                        
                     }
  
      
                });   
                 
            $("body").on("click", ".select-sub-widget" , function(e){  

                      $("#block_val").val($(this).attr("data-server-type"));
                      $(".sub-widgets-popup").hide();
                });
   
           }); 
           $("body").on("click", ".cancel" , function(e){  
                      $('.modal').modal('hide');
            });

           
           $("body").on("click", ".av-total-wrapper" , function(e){ 
               
                  $(this).find('.circle').each(function () {
                     
                        if(!$(this).hasClass("active"))
                        {
                            $(this).addClass("active");
                            $(".filter_circle").val($(this).parent(".left").text());
                        }
                        else
                        {
                           $(this).removeClass("active");
                        }
                   });
               
               
               
                });
   
           $("body").on("click", "#multi-graph-select-types-wrapper" , function(e){  
               
                    var target_data = $(e.target).attr("class");
                    
                        $(".sub-widgets-popup").hide();
                        $(this).children().each(function () {

                            if(target_data ==  $(this).attr("class"))
                            {
                                $(this).addClass("active"); 
                                $("#"+ $(this).attr("data-layout")).show();

                            }
                            else
                            {
                                $(this).removeClass("active");
                                $("#"+ $(this).attr("data-layout")).hide();
                            }

                        });

            });  
            /*  dates blocks ....  */
            $("body").on("click", ".time-template" , function(e){
                
                 if (e.handled !== true) {
                    //put your code here
                      
                    var id = $(this).attr("id");
                    
                    $("#time-select").find(".time-template").each(function () {
                     
                        if(id == $(this).attr("id"))
                        {
                           $(this).addClass("active"); 
                        }
                        else
                        {
                            $(this).removeClass("active"); 
                        }

                  });
                   rf.globals.builder.active_filter_tab = id;
                   
                        var data_group ="";
                        data_group = that.DateCalculations($(this).text());
                        if(data_group !="")
                        {
                            that.ResendToRender(data_group);
                            
                        } 
  
                    e.handled = true;
                }
                return false;  
            });
            
            $("body").on("click", "#change-time-btn" , function(e){
                    if($("#date-from").val() !="")
                    {
                       that.filter_date_first =  $("#date-from").val();
                    }
                    if($("#date-to").val() !="")
                    {
                       that.filter_date_second =  $("#date-to").val();
                    }
             });
            
            
            $('#enable_r_time').click(function() {
                    if ($(this).is(':checked')) {
                      $('#div_refresh_tm').css("display","block");
                    }
                    else
                    {
                        $('#div_refresh_tm').css("display","none");
                    }
            });
            
             $("body").on("click", "#setting_icon"  , function(e){    
                       that.setting_icon_press = true;
                       $('#settingsModal').modal();
                 }); 
             $("body").on("click", "#div_lang"  , function(e){    
                       $('#menu_float').show();
                 }); 
             $("body").on("change", ".select-avl-object" , function(e){     
                   if($(e.target).attr("id") == 'simple_object_data')
                   {
                       if($(this).val() == "default")
                       {
                           $("#simple_show_object").prop('disabled', false);
                           $("#simple_is_pass_zeroth").prop('disabled', false);
                           
                       }
                       else
                       {
                           $("#simple_show_object").prop('disabled', true);
                           $("#simple_is_pass_zeroth").prop('disabled', true);
                       }
                   
                   }
                   else if($(e.target).attr("id") == 'multi_object_data')
                   {
                        if($(this).val() == "default")
                        {
                            $("#multi_is_pass_zeroth").prop('disabled', false);
                        }
                        else
                        {
                            $("#multi_is_pass_zeroth").prop('disabled', true);
                        }
                       
                   }
                   
                 }); 
                 
                 
                 $("body").on("click", ".excel_img"  , function(e){     
                     
                        var id =  that.getWidgetId($(e.target).attr("id"));
                        
                       new  Ajax({method_type : 'POST' ,
                              url : Path+"/ajax/Export" ,
                              data_parameters :{widget_id: id , first_date : that.filter_date_first , second_date : that.filter_date_second} ,
                              request_header : {'Content-Type': 'application/x-www-form-urlencoded'} ,
                              is_sync : true ,
                              response_type : "text",
                              callback_fn : that.export_Result
                             });
                        
                  
                       
                 }); 
        
        
}

razo.prototype.ResetForm = function()
{
    //simple
    $("#simple_object_data").val("default");
    $("#simple_show_object").prop('disabled', false);
    $("#simple_is_pass_zeroth").prop('disabled', false);
    $("#simple_show_object").val(10);
    $("#simple_is_pass_zeroth").attr('checked', false);
    
    $('.select-simple-graph-server-type-wrapper').find(".select-server-type").each(function() {
       $(this).removeClass("active");                 
    });
    //multi
    $("#multi_object_data").val("default");
    $("#multi_is_pass_zeroth").prop('disabled', false);
    $('.multi-graph-layout').find(".select-server-type").each(function() {
           $(this).removeClass("active");                                         
       });
       
   $("#graph-types").children().each(function () 
            {

                if($(this).attr("data-graph-type") == "simple-graph")
                {
                    $(this).addClass("active");
                }
                else
                {
                    $(this).removeClass("active");
                } 

     });     
       
     $("#first-multi-graph-tab").html("Average speed");
     $("#second-multi-graph-tab").html("Simple");    
                                                        
     $("#multi-graph-tabs").hide();    
     $("#simple-graph-tabs").show(); 
    
}

razo.prototype.DateCalculations = function(text)
{
     var that = this;
     var today = new Date();
     var previous_day = today.getDate()-1;
     var yestarday = (today.getMonth()+1)+"-"+previous_day+"-"+today.getFullYear();
     var lastweekday = today.getDate() - 7;
     var tmonth = today.getMonth()+1; 
                 
     var d = new Date(tmonth+"-"+(lastweekday)+"-"+today.getFullYear());
     var day = d.getDay();
     var diff = d.getDate() - day + (day == 0 ? -6:1);
     var firstweekday = new Date(d.setDate(diff));

     var preview_month_fday = new Date(today.getFullYear(), today.getMonth(), 1); 
     var preview_month_lday  = new Date(today.getFullYear(), today.getMonth(), 0);


     var hours =  today.getHours();
     var minute = today.getMinutes();
        if(minute == 0)
        {
                    if(hours == 1)
                    {
                       hours = 23; 
                    }
                    else
                    {
                       hours = hours-1; 
                    }
                    
        }
        else
        {
                   hours = hours-1;  
        }
        minute = (minute < 15)? minute-15+60 : minute-15 ;
        data_group = "";
     switch (text) 
     {
                            case "Yesterday":
                               $("#timepickers").css("display","none");
                               $("#time-label").css("display","block");
                               $("#s_span").css("display","none");
                               $("#s_separator").css("display","none");
                               $("#f_span").text(yestarday);
                               $("#f_span").css("display","block"); 
                               that.filter_date_first = yestarday;   
                               data_group = that.filter_date_first ;
               
                                break;
                            case "Today":
                                $("#timepickers").css("display","none");
                                $("#time-label").css("display","block");
                                $("#s_separator").css("display","none");
                                $("#s_span").css("display","none");
                                $("#f_span").text(tmonth+"-"+today.getDate()+"-"+today.getFullYear());
                                $("#f_span").css("display","block"); 
                                that.filter_date_first = tmonth+"-"+today.getDate()+"-"+today.getFullYear(); 
                                data_group = that.filter_date_first ;
                                break;
                            case "Week":
                                $("#timepickers").css("display","none");
                                $("#time-label").css("display","block");
                                $("#s_separator").css("display","block");
                                $("#s_span").css("display","block");
                                $("#s_span").text(tmonth+"-"+(lastweekday)+"-"+today.getFullYear());
                                $("#f_span").text((firstweekday.getMonth()+1)+"-"+firstweekday.getDate()+"-"+firstweekday.getFullYear());
                                $("#f_span").css("display","block");          
                                that.filter_date_first = (firstweekday.getMonth()+1)+"-"+firstweekday.getDate()+"-"+firstweekday.getFullYear(); 
                                that.filter_date_second = tmonth+"-"+(lastweekday)+"-"+today.getFullYear();
                                data_group = that.filter_date_first;
                                data_group += ","+that.filter_date_second;
                                break;
                            case "Month":
                                $("#timepickers").css("display","none");
                                $("#time-label").css("display","block");
                                $("#s_separator").css("display","block");
                                $("#s_span").css("display","block");
                                $("#s_span").text((preview_month_lday.getMonth()+1)+"-"+preview_month_lday.getDate()+"-"+preview_month_lday.getFullYear());
                                $("#f_span").text((preview_month_fday.getMonth())+"-"+preview_month_fday.getDate()+"-"+preview_month_fday.getFullYear());
                                $("#f_span").css("display","block");      
                                that.filter_date_first = (preview_month_fday.getMonth())+"-"+preview_month_fday.getDate()+"-"+preview_month_fday.getFullYear(); 
                                that.filter_date_second =(preview_month_lday.getMonth()+1)+"-"+preview_month_lday.getDate()+"-"+preview_month_lday.getFullYear();
                                data_group = that.filter_date_first;
                                data_group += ","+that.filter_date_second;
                                break;
                            case "Other":
                               $("#timepickers").css("display","inline-block");
                               $("#time-label").css("display","none");
                              
                                break;
                            case "real time":
                                $("#timepickers").css("display","none");
                                $("#time-label").css("display","block");
                                $("#s_separator").css("display","none");
                                $("#s_span").css("display","none");
                               
                               $("#f_span").text(tmonth+"-"+today.getDate()+"-"+today.getFullYear()+"  "+hours+":"+minute);
                               $("#f_span").css("display","block");      
                               that.filter_date_first = tmonth+"-"+today.getDate()+"-"+today.getFullYear()+"  "+hours+":"+minute;
                                data_group = that.filter_date_first;
                 
                                break;    
                               
                            
        }
    
    
    return data_group;

}
razo.prototype.getWidgetId = function(widget_cont)
{
  
     for(var a in this.dbAsJson.components) 
     {
         if(a == widget_cont)
         {
             return this.dbAsJson.components[a].props.component_id;
             break;
         }
     }
    return 0;
}
razo.prototype.initopacity  = function()
{
    $(".line-chart").css("opacity" , .4);
    $(".vertical-bar-chart").css("opacity" , .4);
    $(".vertical-stacked-bar-chart").css("opacity" , .4);
    $(".vertical-stacked-bar-chart").css("opacity" , .4);
    $(".horizontal-bar-chart").css("opacity" , .4);
    
}
razo.prototype.removeClickableComponent = function(e , obj)
{
      var selected_component = obj.attr("id");
      var that = this;
      $(".fixed").hide(); 
      
      var id = selected_component.split("_");
      
      
      
      
    //  1 - remove using component key and remove it from json itself and then rebuild dashboard
  
   /*   
    delete this.dbAsJson.components[selected_component];
    console.log("public json " + JSON.stringify(this.publicobj));
    this.db.pro.lock(); 
    this.db.pro.dispose();
    this.buildDashboardFromObject(this.dbAsJson);  */
    
    
    // send to server to delete from db
       that.db.pro.lock(); 
       rf.globals.builder.ajaxRequest.ajax({
                          
                           url: delete_path,
                           type : "POST" ,
                           data : {id : id[1]},
                           success: function(data) {
                               
                               var return_data =  JSON.parse(data);
                             
                               if(return_data.sucess)
                               {
                                    // 2 - remove component using dashboard object   
                                    that.removeComponentFromDashboard(selected_component);
                                    that.dbAsJson =  that.publicobj;
                                    that.db.pro.lock(); 
                                    that.db.pro.dispose();
                                    that.buildDashboardFromObject(that.dbAsJson);
                                    that.installForms(); 
                                    rf.globals.builder.installActiveTabs();
                                    $("#date-from").datepicker();
                                    $("#date-to").datepicker();
                               }
               
                           }
                       });
}

razo.prototype.renderTableClick = function(e , obj )
{
    var json = this.dbAsJson;
    var icon  = "";
    var LeafIcon = this.LeafIcon;
    var latlang = [];
      for(var a in this.dbAsJson.components) 
     {
         if(this.dbAsJson.components[a].type == "TableComponent")
         {
             
             if(this.dbAsJson.components[a].props.table.enable_map)
             {
                   // alert(e.clientX);
                    var offset = obj.offset();
                    var moveLeft = 20;
                    var moveDown = 10;

                    $(".fixed").css({
                                   "display" : "block"  ,
                                   left:  e.pageX + moveLeft ,
                                   top: e.pageY + moveDown    ,
                            })  ;


                       obj.find('td').each (function() {
                           
                           if(json.components[a].props.table.map_column_name != "")
                           {
                                 if($(this).data("id") == json.components[a].props.table.map_column_name)
                                 {
                                        icon =  new LeafIcon({iconUrl: $(this).find("p .hid_img").val()});
                                 }
                                 
                                 if($(this).data("id") == "lat")
                                 {
                                    
                                     latlang[0] = $(this).find("."+$(this).data("id")).val();
                                 }
                                 if($(this).data("id") == "lang")
                                 {
                                    
                                     latlang[1] = $(this).find("."+$(this).data("id")).val();
                                 }
                                 

                               
                           }
                          
                       }); 
                       
                      if(this.marker != null)
                      {
                           this.map.removeLayer(this.marker);
                      }
                     
                     if(icon == "")
                     {
                       // this.marker =   L.marker([51.5, -0.09]).addTo(this.map);
                     }
                     else
                     {
                         this.marker =  L.marker(latlang , {icon: icon}).addTo(this.map);
                     }
 
                    $(".fixed").show(); 
                    break;
                 
                 
             }
             
             
             
         }
     }

}
razo.prototype.renderPieClick = function(e , obj , that  )
{
   
     if (e.target === this) return;
 
     that.is_used_multi = "";
     that.current_key   = obj.parent().parent().find(".widget_hidden").val();
   
   
   
     that.is_used_multi = obj.parent().find(".second_hidden").val()
     that.dbAsJson =  that.getClickableRelated(that.selected_icon);
   
    
     if(this.data_changed)
     {
         this.db.pro.lock(); 
         this.db.pro.dispose();
         this.buildDashboardFromObject(this.dbAsJson);
         
         that.installForms();  
         rf.globals.builder.installActiveTabs();
         $("#date-from").datepicker();
         $("#date-to").datepicker();

     }
     
    

}


razo.prototype.ResendToRender = function(data_group)
{
            var that = this;
            rf.globals.builder.db.pro.lock();
            rf.globals.builder.ajaxRequest.ajax({
                           url: render_dash_path,
                           data : {date_arr : data_group},
                           success: function(data) {
                               rf.globals.builder.db.pro.dispose();
                               rf.globals.builder.buildDashboardFromObject(JSON.parse(data));
                               rf.globals.builder.installForms(); 
                               rf.globals.builder.installActiveTabs();
                               $("#date-from").datepicker();
                               $("#date-to").datepicker();
                               
                               
                        
                           }
                       });
   
}



razo.prototype.getClickableRelated = function(type)
{
    
     var json_txt = this.dbAsJson; 
     var json_arr = null;
     this.data_changed = false ;
     
     var that = this;
     for(var a in this.dbAsJson.components) 
     { 
             if(a == this.current_key)
             {
                 if( this.dbAsJson.clickable_data[this.current_key] != undefined   &&   this.dbAsJson.clickable_data[this.current_key].length  > 0)
                 {
                       var refrence_click_arr = this.dbAsJson.ref_clickable_arr[this.current_key];
                                                         

                         _.each(refrence_click_arr , function(v)
                                {
                                 
                                    var selected_click = that.dbAsJson.clickable_data[that.current_key];
                                  
                                    _.each( selected_click, function(c)
                                    {
                                        if(c.props.component_key == v[type])
                                        {
                                             if(that.dbAsJson.components[a].props.core.chart_type == "multi")  // multi
                                            {
                                                if(typeof that.is_used_multi != "undefined")
                                                {
                                                    if(type == "line")
                                                    {
                                                         json_arr =  that.dbAsJson.clickable_data[that.current_key][2];
                                                    }
                                                    else
                                                    {
                                                         json_arr =  that.dbAsJson.clickable_data[that.current_key][3];
                                                    }
                                                   
                                                }
                                                else
                                                {
                                                    if(type == "line")
                                                    {
                                                         json_arr =  that.dbAsJson.clickable_data[that.current_key][0];
                                                    }
                                                    else
                                                    {
                                                         json_arr =  that.dbAsJson.clickable_data[that.current_key][1];
                                                    }
                                                 
                                                }

                                            }
                                            else
                                            {
                                                 json_arr = c;
                                            }

                               
                                           
                                          
                                        }
                                        
                                       

                                    });
                                    
                                });
         
                    json_txt.components[a] =  json_arr ;
                    this.data_changed = true ;
                 
                    break;
                     
                     
                     
                     
                  }
                 
                
                 
             }
     
     } 
     return json_txt;
    
}

