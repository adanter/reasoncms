$(document).ready(function() {
    var $formSteps = $("div[id='formNavigation'] > ul > li > a");
    $.each($formSteps, function(index, value){
        $formSteps[index].href = '#';
        $(this).click(function(event){
            event.preventDefault();
            var $number;
            switch(index){
                case 0:
                    $number = "One";
                    break;
                case 1:
                    $number = "Two";
                    break;
                case 2:
                    $number = "Three";
                    break;
                case 3:
                    $number = "Four";
                    break;
                case 4:
                    $number = "Five";
                    break;
                case 5:
                    $number = "Six";
                    break;
            }
            $("input[name='__button_ApplicationPage" + $number + "']").click();
        })
    });

    /**All Pages **/
    /**************/
    $("input[name*='first_name']").watermark('First');
    $("input[name*='middle_name']").watermark('Middle');
    $("input[name*='last_name']").watermark('Last');
    $("input[name*='preferred_first_name']").watermark('Nickname');
    $("input[name*='age']").watermark('Age');
    $("input[name*='grade']").watermark('Grade');
    
    $('.addButton').button({
        icons: {
            primary:'ui-icon-plusthick',
            secondary:'ui-icon-plusthick'
        }
    });

    $('.removeButton').button({
        icons: {
            primary:'ui-icon-minusthick',
            secondary:'ui-icon-minusthick'
        }
    });

    /**Page One - Enrollment Info **/
    /*******************************/
    $("#transfer_dialog").dialog({
        autoOpen: false,
        show: "blind",
        hide: "blind",
        modal: true
    });
    $("input[name='student_type']").change(function(){
        if ($("#radio_student_type_1").is(":checked")){
            $("#transfer_dialog").dialog("open");
            return false;
        }
    });

    $("#citizenship_dialog").dialog({
        autoOpen: false,
        show: "blind",
        hide: "blind",
        modal: true
    });
    $("input[name='citizenship_status']").change(function(){
        if ($("#radio_citizenship_status_3").is(":checked")){
            $("#citizenship_dialog").dialog("open");
            return false;
        }
    });

    /**Page Two - Personal Info **/
    /*****************************/
    $("#date_of_birth-mm").watermark('mm');
    $("#date_of_birth-dd").watermark('dd');
    $("#date_of_birth").watermark('yyyy');

    $("#ssn_dialog").dialog({
        autoOpen: false,
        show: "blind",
        hide: "blind",
        modal: true
    });
    $("#ssn").click(function(){
        $("#ssn_dialog").dialog("open");
        return false;
    });
    $("#faith_dialog").dialog({
        autoOpen: false,
        show: "blind",
        hide: "blind",
        modal: true
    });
    $("#faith").click(function(){
        $("#faith_dialog").dialog("open");
        return false;
    });

    

    toggle_mailing_address();
    $("input[name='different_mailing_address']").change(function(){
        toggle_mailing_address();
    });


    /**Page Three - Family**/
    /***********************/	
    $("#family_dialog").dialog({
        autoOpen: false,
        show: "blind",
        hide: "blind",
        modal: true
    });
    $("#family").click(function(){
        $("#family_dialog").dialog("open");
        return false;
    });

    toggle_parent_college();
    $("input[name='legacy']").change(function(){
        toggle_parent_college();
    });
    //autocomplete Parent's College
    $('#parent_1_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });
    $('#parent_2_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });
    $('#guardian_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });

    perculate_siblings_up();

    $('#removeSibling').css('display', 'none'); // did this instead of hide because hide was removing some other css from the button
    for (i=2; i<=5; i += 1)
    {
        if (has_data('[id^=sibling'+i+']')) {
            sibling_count += 1;
        } else {
            $('[id^=sibling'+i+']').hide();
        }
        if (sibling_count == 5) {
            $('#addSibling').hide();
        }
        if (sibling_count == 2) {
            $('#removeSibling').show();
        }
    }
    //autocomplete Sibling's College'
    $('#sibling_1_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });
    $('#sibling_2_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });
    $('#sibling_3_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });
    $('#sibling_4_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });
    $('#sibling_5_collegeElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3
    });
    //$("input[name='sibling_1_relation']").change(function(){
    //    add_sibling();
    //});

    $('#addSibling').click(function(){
        add_sibling();
    });
    $('#removeSibling').click(function(){
        remove_sibling();
    });

    /**Page Four - Education**/
    /**************************/

    $('#hs_nameElement').focus();
    $("#hs_nameElement").autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3,
        select: function( event, ui )
        {
            $( '#hs_addressElement' ).val(ui.item.current_hs_address);
            $( '#hs_cityElement' ).val(ui.item.current_hs_city);
            $( '#hs_state_provinceElement' ).val(ui.item.current_hs_state);
            $( '#hs_zipElement' ).val(ui.item.current_hs_zip);
            $( '#hs_countryElement' ).val(ui.item.current_hs_country);
   	}
    });

    $('#college_1_nameElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3,
        select: function( event, ui )
        {
            $( '#college_1_addressElement' ).val(ui.item.current_hs_address);
            $( '#college_1_cityElement' ).val(ui.item.current_hs_city);
            $( '#college_1_state_provinceElement' ).val(ui.item.current_hs_state);
            $( '#college_1_zipElement' ).val(ui.item.current_hs_zip);
            $( '#college_1_countryElement' ).val(ui.item.current_hs_country);
   	}
    });

    $('#college_2_nameElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3,
        select: function( event, ui )
        {
            $( '#college_2_addressElement' ).val(ui.item.current_hs_address);
            $( '#college_2_cityElement' ).val(ui.item.current_hs_city);
            $( '#college_2_state_provinceElement' ).val(ui.item.current_hs_state);
            $( '#college_2_zipElement' ).val(ui.item.current_hs_zip);
            $( '#college_2_countryElement' ).val(ui.item.current_hs_country);
   	}
    });

    $('#college_3_nameElement').autocomplete({
        source: "https://reasondev.luther.edu/reason/autocomplete/ceeb.php",
        minLength: 3,
        select: function( event, ui )
        {
            $( '#college_3_addressElement' ).val(ui.item.current_hs_address);
            $( '#college_3_cityElement' ).val(ui.item.current_hs_city);
            $( '#college_3_state_provinceElement' ).val(ui.item.current_hs_state);
            $( '#college_3_zipElement' ).val(ui.item.current_hs_zip);
            $( '#college_3_countryElement' ).val(ui.item.current_hs_country);
   	}
    });

    perculate_college_up();
    $('#removeCollege').css('display', 'none'); // did this instead of hide because hide was removing some other css from the button$('#removeCollege').css('display', 'none'); // did this instead of hide because hide was removing some other css from the button
    for (i=2; i<=3; i += 1)
    {
        if (college_has_data('#college_'+i+'_nameElement')) {
            college_count += 1;
        } else {
            $('[id^=college'+i+']').hide();
        }
        if (college_count == 3) {
            $('#addCollege').hide();
        }
        if (college_count == 2) {
            $('#removeCollege').show();
        }
    }
    

    $('#addCollege').click(function(){
        add_college();
    });

    $('#removeCollege').click(function(){
        remove_college();
    });

    //    $("#state_abbrev").autocomplete({
    //        source: "states_abbrev.php",
    //        minLength: 2
    //    });


    /**Page Five - Activities & Honors**/
    /**********************************/
    toggle_other_activity_details();
    //    $("input[name='band_participant']").change(function(){toggle_fields('band_participant','band_instrument'); });
    $("select[name='activity_1']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_2']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_3']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_4']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_5']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_6']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_7']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_8']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_9']").change(function(){
        toggle_other_activity_details();
    });
    $("select[name='activity_10']").change(function(){
        toggle_other_activity_details();
    });
    
    perculate_activity_up();
    
    $('#removeActivity').css('display', 'none'); // did this instead of hide because hide was removing some other css from the button
    for (i=2; i<=10; i += 1)
    {
        if (activity_has_data('#activity_'+i+'Element')) {
            activity_count += 1;
        } else {
            $('[id^=activity'+i+']').hide();
        }
        if (activity_count == 10) {
            $('#addActivity').hide();
        }
        if (activity_count == 2) {
            $('#removeActivity').show();
        }
    }
    

    $('#addActivity').click(function(){
        add_activity();
    });

    $('#removeActivity').click(function(){
        remove_activity();
    });

    /**Page Six - **/
    /**********************************/
    toggle_instrument_info();
    $("input[name='music_audition']").change(function(){
        toggle_instrument_info();
    });

    toggle_conviction_history();
    $("input[name='conviction_history']").change(function(){
        toggle_conviction_history();
    });
    toggle_hs_discipline();
    $("input[name='hs_discipline']").change(function(){
        toggle_hs_discipline();
    });
});
function perculate_siblings_up() {
    // moves siblings up if the applicant has enterred blank siblings between
    //  non blank siblings
    blank_q = [];
    for (i=1; i<=5; i += 1)
    {
        if (has_data('[id^=sibling'+i+']') && blank_q[0] != null) {
            move_sibling_data(i, blank_q.shift());
            blank_q.push(i);
        } else if (! has_data('[id^=sibling'+i+']')) {
            blank_q.push(i);
        }
    }
}

function move_sibling_data(from_sibling, to_sibling) {
    // move sibling data from from_sibling to to_sibling and clear out the from_sibling
    $('#sibling_'+to_sibling+'_first_nameElement').val($('#sibling_'+from_sibling+'_first_nameElement').val());
    $('#sibling_'+from_sibling+'_first_nameElement').val('');
    $('#sibling_'+to_sibling+'_last_nameElement').val($('#sibling_'+from_sibling+'_last_nameElement').val());
    $('#sibling_'+from_sibling+'_last_nameElement').val('');
    $('#sibling_'+to_sibling+'_ageElement').val($('#sibling_'+from_sibling+'_ageElement').val());
    $('#sibling_'+from_sibling+'_ageElement').val('');
    $('#sibling_'+to_sibling+'_gradeElement').val($('#sibling_'+from_sibling+'_gradeElement').val());
    $('#sibling_'+from_sibling+'_gradeElement').val('');
    $('#sibling_'+to_sibling+'_collegeElement').val($('#sibling_'+from_sibling+'_collegeElement').val());
    $('#sibling_'+from_sibling+'_collegeElement').val('');
    $('#radio_sibling_'+to_sibling+'_relation_0').attr('checked', $('#radio_sibling_'+from_sibling+'_relation_0').attr('checked'));
    $('#radio_sibling_'+from_sibling+'_relation_0').attr('checked', false);
    $('#radio_sibling_'+to_sibling+'_relation_1').attr('checked', $('#radio_sibling_'+from_sibling+'_relation_1').attr('checked'));
    $('#radio_sibling_'+from_sibling+'_relation_1').attr('checked', false);
}

function perculate_activity_up() {
    // moves activity up if the applicant has enterred blank activity between
    //  non blank activity
    blank_q = [];
    for (i=1; i<=10; i += 1)
    {
//        alert(activity_has_data('#activity_'+i+'Element'));
        if (activity_has_data('#activity_'+i+'Element') && blank_q[0] != null) {
            move_activity_data(i, blank_q.shift());
            blank_q.push(i);
        } else if (! activity_has_data('#activity_'+i+'Element')) {
//            alert('pushing');
            blank_q.push(i);
        } 
    }
}

function move_activity_data(from_activity, to_activity) {
    // move sibling data from from_activity to to_activity and clear out the from_activity
    $('#activity_'+to_activity+'Element').val($('#activity_'+from_activity+'Element').val());
    $('#activity_'+from_activity+'Element').val('1');
    $('#activity_'+to_activity+'_otherElement').val($('#activity_'+from_activity+'_otherElement').val());
    $('#activity_'+from_activity+'_otherElement').val('');
    $('#activity_'+to_activity+'_honorsElement').val($('#activity_'+from_activity+'_honorsElement').val());
    $('#activity_'+from_activity+'_honorsElement').val('');
    $('#checkbox_activity_'+to_activity+'_participation_0').attr('checked', $('#checkbox_activity_'+from_activity+'_participation_0').attr('checked'));
    $('#checkbox_activity_'+from_activity+'_participation_0').attr('checked', false);
    $('#checkbox_activity_'+to_activity+'_participation_1').attr('checked', $('#checkbox_activity_'+from_activity+'_participation_1').attr('checked'));
    $('#checkbox_activity_'+from_activity+'_participation_1').attr('checked', false);
    $('#checkbox_activity_'+to_activity+'_participation_2').attr('checked', $('#checkbox_activity_'+from_activity+'_participation_2').attr('checked'));
    $('#checkbox_activity_'+from_activity+'_participation_2').attr('checked', false);
    $('#checkbox_activity_'+to_activity+'_participation_3').attr('checked', $('#checkbox_activity_'+from_activity+'_participation_3').attr('checked'));
    $('#checkbox_activity_'+from_activity+'_participation_3').attr('checked', false);
    $('#checkbox_activity_'+to_activity+'_participation_4').attr('checked', $('#checkbox_activity_'+from_activity+'_participation_4').attr('checked'));
    $('#checkbox_activity_'+from_activity+'_participation_4').attr('checked', false);
}

function perculate_college_up() {
    // moves siblings up if the applicant has enterred blank siblings between
    //  non blank siblings
    blank_q = [];
    for (i=1; i<=3; i += 1)
    {
        if (college_has_data('#college_'+i+'_nameElement') && blank_q[0] != null) {
            move_college_data(i, blank_q.shift());
            blank_q.push(i);
        } else if (! college_has_data('#college_'+i+'_nameElement')) {
            blank_q.push(i);
        }
    }
}

function move_college_data(from_college, to_college) {
    // move sibling data from from_sibling to to_sibling and clear out the from_sibling
    $('#college_'+to_college+'_nameElement').val($('#college_'+from_college+'_nameElement').val());
    $('#college_'+from_college+'_nameElement').val('');
}

function college_has_data(selector) {
    if ($(selector).val() != '') {
        return true;
    }
    return false;
}

function has_data(selector) {
//    alert(selector);
    return_val = false;
    $(selector).find(':text').each( function() {
        //alert($(this).val());
        if ($(this).val() != '') {
            return_val = true;
            return false;
        }
    });
    return return_val;
}

function activity_has_data(selector) {
    if ($(selector).val() != '') {
        return true;
    }
    return false;
}


var sibling_count = 1;
function add_sibling() {
    sibling_count += 1;
    $('[id^=sibling'+sibling_count+']').show();
    if (sibling_count == 5) {
        $('#addSibling').hide();
    }
    if (sibling_count == 2) {
        $('#removeSibling').show();
    }
}
function remove_sibling() {
    $('[id^=sibling'+sibling_count+']').hide();
    $('[id^=sibling'+sibling_count+']').find('input[type="text"]').each(function() {
        $(this).val("");
    });
    $('[id^=sibling'+sibling_count+']').find('input[type="radio"]').each(function() {
        $(this).attr('checked', false);
    });
    $('[id^=sibling_'+sibling_count+'_state_provinceElement]').val('1');
    $('[id^=sibling_'+sibling_count+'_countryElement]').val('1');
    sibling_count -= 1;
    if (sibling_count == 1) {
        $('#removeSibling').hide();
    }
    if (sibling_count == 4) {
        $('#addSibling').show();
    }
}

var activity_count = 1;
function add_activity() {
    activity_count += 1;
    $('[id^=activity'+activity_count+']:not([id*=other])').show();
    if (activity_count == 10) {
        $('#addActivity').hide();
    }
    if (activity_count == 2) {
        $('#removeActivity').show();
    }
}
function remove_activity() {
    $('[id^=activity'+activity_count+']').hide();
    $('[id^=activity'+activity_count+']').find('input[type="text"]').each(function() {
        $(this).val("");
    });
    $('[id^=activity'+activity_count+']').find('input[type="radio"],input[type="checkbox"]').each(function() {
        $(this).attr('checked', false);
    });
    $('[id^=activity_'+activity_count+'Element]').val('1');
    activity_count -= 1;
    if (activity_count == 1) {  
        $('#removeActivity').hide();
    }
    if (activity_count == 9) {
        $('#addActivity').show();
    }
}

var college_count = 1;
function add_college() {
    college_count += 1;
    $('[id^=college'+college_count+']').show();
    if (college_count == 3) {
        $('#addCollege').hide();
    }
    if (college_count == 2) {
        $('#removeCollege').show();
    }
}
function remove_college() {
    $('[id^=college'+college_count+']').hide();
    $('[id^=college'+college_count+']').find('input[type="text"]').each(function() {
        $(this).val("");
    });
    $('[id^=college'+college_count+']').find('input[type="radio"]').each(function() {
        $(this).attr('checked', false);
    });
    $('[id^=college_'+college_count+'_state_provinceElement]').val('1');
    $('[id^=college_'+college_count+'_countryElement]').val('1');
    college_count -= 1;
    if (college_count == 1) {
        $('#removeCollege').hide();
    }
    if (college_count == 2) {
        $('#addCollege').show();
    }
}
function toggle_conviction_history() {
    if ($("input[name='conviction_history']:checked").val() == 'Yes') {
        $("#convictiondetailscommentRow").show();
        $("#convictionhistorydetailsRow").show();
    } else {
        $("#convictiondetailscommentRow").hide();
        $("#convictionhistorydetailsRow").hide();
    }
}
function toggle_hs_discipline() {
    if ($("input[name='hs_discipline']:checked").val() == 'Yes') {
        $("#disciplinedetailscommentRow").show();
        $("#hsdisciplinedetailsRow").show();
    } else {
        $("#disciplinedetailscommentRow").hide();
        $("#hsdisciplinedetailsRow").hide();
    }
}
function toggle_instrument_info() {
    if ($("input[name='music_audition']:checked").val() == 'Yes') {
        $("#instrumentcommentRow").show();
        $("#musicauditioninstrumentRow").show();
    } else {
        $("#instrumentcommentRow").hide();
        $("#musicauditioninstrumentRow").hide();
    }
}
function toggle_mailing_address() {
    if ($("input[name='different_mailing_address']:checked").val() == 'Yes') {
        $("#mailingaddressRow").show();
        $("#mailingapartmentnumberRow").show();
        $("#mailingcityRow").show();
        $("#mailingstateprovinceRow").show();
        $("#mailingzippostalRow").show();
        $("#mailingcountryRow").show();
    } else {
        $("#mailingaddressRow").hide();
        $("#mailingapartmentnumberRow").hide();
        $("#mailingcityRow").hide();
        $("#mailingstateprovinceRow").hide();
        $("#mailingzippostalRow").hide();
        $("#mailingcountryRow").hide();
    }
}

function toggle_parent_college() {
    if ($("input[name='legacy']:checked").val() == 'Yes') {
        $("#parent1collegecommentRow").show();
        $("#parent1collegeRow").show();
//        $("#parent1collegeaddressRow").show();
//        $("#parent1collegecityRow").show();
//        $("#parent1collegestateprovinceRow").show();
//        $("#parent1collegezippostalRow").show();
//        $("#parent1collegecountryRow").show();
        $("#parent2collegecommentRow").show();
        $("#parent2collegeRow").show();
//        $("#parent2collegeaddressRow").show();
//        $("#parent2collegecityRow").show();
//        $("#parent2collegestateprovinceRow").show();
//        $("#parent2collegezippostalRow").show();
//        $("#parent2collegecountryRow").show();
        $("#guardiancollegecommentRow").show();
        $("#guardiancollegeRow").show();
//        $("#guardiancollegeaddressRow").show();
//        $("#guardiancollegecityRow").show();
//        $("#guardiancollegestateprovinceRow").show();
//        $("#guardiancollegezippostalRow").show();
//        $("#guardiancollegecountryRow").show();
    } else {
        $("#parent1collegecommentRow").hide();
        $("#parent1collegeRow").hide();
//        $("#parent1collegeaddressRow").hide();
//        $("#parent1collegecityRow").hide();
//        $("#parent1collegestateprovinceRow").hide();
//        $("#parent1collegezippostalRow").hide();
//        $("#parent1collegecountryRow").hide();
        $("#parent2collegecommentRow").hide();
        $("#parent2collegeRow").hide();
//        $("#parent2collegeaddressRow").hide();
//        $("#parent2collegecityRow").hide();
//        $("#parent2collegestateprovinceRow").hide();
//        $("#parent2collegezippostalRow").hide();
//        $("#parent2collegecountryRow").hide();
        $("#guardiancollegecommentRow").hide();
        $("#guardiancollegeRow").hide();
//        $("#guardiancollegeaddressRow").hide();
//        $("#guardiancollegecityRow").hide();
//        $("#guardiancollegestateprovinceRow").hide();
//        $("#guardiancollegezippostalRow").hide();
//        $("#guardiancollegecountryRow").hide();
    }
}
function toggle_other_activity_details() {
    if ($("select[name='activity_1']").val() == 'Other') {
        $("tr#activity1otherRow").show();
    } else {
        $("tr#activity1otherRow").hide();
    }
    if ($("select[name='activity_2']").val() == 'Other') {
        $("tr#activity2otherRow").show();
    } else {
        $("tr#activity2otherRow").hide();
    }
    if ($("select[name='activity_3']").val() == 'Other') {
        $("tr#activity3otherRow").show();
    } else {
        $("tr#activity3otherRow").hide();
    }
    if ($("select[name='activity_4']").val() == 'Other') {
        $("tr#activity4otherRow").show();
    } else {
        $("tr#activity4otherRow").hide();
    }
    if ($("select[name='activity_5']").val() == 'Other') {
        $("tr#activity5otherRow").show();
    } else {
        $("tr#activity5otherRow").hide();
    }
    if ($("select[name='activity_6']").val() == 'Other') {
        $("tr#activity6otherRow").show();
    } else {
        $("tr#activity6otherRow").hide();
    }
    if ($("select[name='activity_7']").val() == 'Other') {
        $("tr#activity7otherRow").show();
    } else {
        $("tr#activity7otherRow").hide();
    }
    if ($("select[name='activity_8']").val() == 'Other') {
        $("tr#activity8otherRow").show();
    } else {
        $("tr#activity8otherRow").hide();
    }
    if ($("select[name='activity_9']").val() == 'Other') {
        $("tr#activity9otherRow").show();
    } else {
        $("tr#activity9otherRow").hide();
    }
    if ($("select[name='activity_10']").val() == 'Other') {
        $("tr#activity10otherRow").show();
    } else {
        $("tr#activity10otherRow").hide();
    }
}
