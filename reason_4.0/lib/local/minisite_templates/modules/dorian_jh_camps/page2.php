<?php
////////////////////////////////////////////////////////////////////////////////
//
//    Steve Smith
//    Lucas Welper
//    2011-01-26
//
//    Work on the second page of the dorian camp form
//
////////////////////////////////////////////////////////////////////////////////

class DorianJHCampsTwoForm extends FormStep
{
    var $_log_errors = true;
    var $error;
    var $display_name = 'Participation';
    var $error_header_text = 'Please check your form.';


    var $band_instruments_array = array(
        'Piccolo'               => 'Piccolo',
        'Flute'                 => 'Flute',
        'Oboe'                  => 'Oboe',
        'Bassoon'               => 'Bassoon',
        'Clarinet'              => 'Clarinet',
        'Bass Clarinet'         => 'Bass Clarinet',
        'Alto Sax'              => 'Alto Sax',
        'Tenor Sax'             => 'Tenor Sax',
        'Baritone Sax'          => 'Baritone Sax',
        'Horn'                  => 'Horn',
        'Trumpet'               => 'Trumpet',
        'Trombone'              => 'Trombone',
        'Euphonium/Baritone BC' => 'Euphonium/Baritone BC',
        'Euphonium/Baritone TC' => 'Euphonium/Baritone TC',
        'Tuba'                  => 'Tuba',
        'Percussion'            => 'Percussion',
        );
    var $orchestra_instruments_array = array(
        'Violin'    => 'Violin',
        'Viola'     => 'Viola',
        'Cello'     => 'Cello',
        'Bass'      => 'Bass',
        'Harp'      => 'Harp',
        );
    var $woodwind_choir_instruments_array = array(
        'Flute'         => 'Flute',
        'Oboe'          => 'Oboe',
        'Bassoon'       => 'Bassoon',
        'Clarinet'      => 'Clarinet',
        'Bass Clarinet' => 'Bass Clarinet',
        'Alto Sax'      => 'Alto Sax',
        'Tenor Sax'     => 'Tenor Sax',
        'Baritone Sax'  => 'Baritone Sax',
        );
    var $brass_choir_instruments_array = array(
        'Trumpet'               => 'Trumpet',
        'Horn'                  => 'Horn',
        'Trombone'              => 'Trombone',
        'Euphonium/Baritone BC' => 'Euphonium/Baritone BC',
        'Euphonium TC'          => 'Euphonium TC',
        'Tuba'                  => 'Tuba',
        );
    var $jazz_band_instruments_array = array(
        'Alto Sax'      => 'Alto Sax',
        'Tenor Sax'     => 'Tenor Sax',
        'Baritone Sax'  => 'Baritone Sax',
        'Trumpet'       => 'Trumpet',
        'Trombone'      => 'Trombone',
        'Guitar'        => 'Guitar',
        'Bass'          => 'Bass',
        'Percussion'    => 'Percussion',
        'Piano'         => 'Piano',
        );
    var $lesson_instruments_array = array(
        'Voice'                 => 'Voice',
        'Dance'                 => 'Dance',
        'Flute'                 => 'Flute',
        'Oboe'                  => 'Oboe',
        'Bassoon'               => 'Bassoon',
        'Clarinet'              => 'Clarinet',
        'A. Sax'                => 'A. Sax',
        'T. Sax'                => 'T. Sax',
        'B. Sax'                => 'B. Sax',
        'Horn'                  => 'Horn',
        'Trumpet'               => 'Trumpet',
        'Trombone'              => 'Trombone',
        'Euphonium/Baritone'    => 'Euphonium/Baritone',
        'Tuba'                  => 'Tuba',
        'Percussion'            => 'Percussion',
        'Violin'                => 'Violin',
        'Viola'                 => 'Viola',
        'Cello'                 => 'Cello',
        'String Bass'           => 'String Bass',
        'Harp'                  => 'Harp',
        'Piano'                 => 'Piano',
        'Organ'                 => 'Organ',
        'Harpsichord'           => 'Harpsichord',
        'Classical guitar'      => 'Classical guitar',
        'Bass Guitar'           => 'Bass Guitar (if a teacher is available)',
        );

    var $elements = array(
        'participation_header' => array(
            'type'  => 'comment',
            'text'  => '<h3>Participation</h3>',
        ),
        'participation_header_2' => array(
            'type'  => 'comment',
            'text'  => 'Check which you will be participating in:'
        ),
        'choir_participant' => array(
            'type'          => 'checkboxfirst',
            'display_name'  => 'Choir',
        ),
        'band_participant' => array(
            'type'          => 'checkboxfirst',
            'display_name'  => 'Band',
        ),
        'band_instrument' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'options' => array(),
        ),
        'orchestra_participant' => array(
            'type'          => 'checkboxfirst',
            'display_name'  => 'Orchestra',
        ),
        'orchestra_instrument' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'options' => array(),
        ),
        'jazz_participant' => array(
            'type'          => 'checkboxfirst',
            'display_name'  => 'Jazz Band',
        ),
        'jazz_instrument' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'options' => array(),
        ),
        'wind_choir_participant' => array(
            'type'          => 'checkboxfirst',
            'display_name'  => 'Woodwind Choir',
        ),
        'wind_choir_instrument' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'options' => array(),
        ),
        'brass_choir_participant' => array(
            'type'          => 'checkboxfirst',
            'display_name'  => 'Brass Choir',
        ),
        'brass_choir_instrument' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'options' => array(),
        ),
        'private_lessons' => array(
           'type'                   => 'radio_inline_no_sort',
           'display_name'           => '<h3>Sets of Private Lessons</h3>',
           'comments'               => '<ul><li>Each pair of lessons costs $39</li><li>One set equals two half-hour lessons</li></ul>',
           'options' => array(0 => 'None', 1 => '1 set' ,2 => '2 sets'),
        ),
        'lesson_instrument_1' => array(
            'type' => 'select_no_sort',
            'display_name' => 'Instrument',
            'add_null_value_to_top' => true,
            'options' => array(),
        ),
        'lesson_instrument_2' => array(
            'type'                  => 'select_no_sort',
            'display_name'          => 'Instrument 2',
            'add_null_value_to_top' => true,
            'options' => array(),
        ),
        'period_header' => array(
            'type'      => 'comment',
            'text'      => '<h3>Registration guidelines for the scheduling choices below</h3>',
            'comments'  =>
                '<ol>
                <li>1) You may choose to leave one period free each day.  You may not leave more than two free.</li>
                <li>2) Ensembles and workshops meet more than one period per day (as noted in each selection);  register for each session of these multipart activities.</li>
                </ol>'
        ),
        'period_one' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => 'Period 1 – 8:00-9:15',
            'options' => array(
                'orchestra'=>'Orchestra (Strings - periods 4 & 5 also)',
                'concert_band'=>'Concert Band (with period 5)',
                'dance_1'=>'Dance 1',
            ),
        ),
        'period_two' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => 'Period 2 – 9:30-10:45',
            'options' => array(
                'choir'=>'Choir (with period 6)',
            ),
        ),
        'period_three_first' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => 'Period 3 – 11:00-noon',
            'comments'              => 'first choice',
            'options' => array(
                'composition'           =>'Composition',
                'elements_of_music'     =>'Elements of Music',
                'girls_vocal_ensemble'  =>'Girls Vocal Ensemble',
                'dance_2'               =>'Dance 2',
                'jazz_band_blue'        =>'Jazz Band Blue (or Jazz Class)',
                'mask_a'                =>'Mask Making A',
                'design_a'              =>'Process of Design A',
                'screen_print_a'        =>'Screen Printing A',
                'stop_motion_a'         =>'Stop Motion Animation A',
                'percussion_ensemble_A' =>'Percussuion Ensemble A',
                'keyboard_workshop_A'   =>'Keyboard Workshop A',
                'vocal_performance_A'   =>'Vocal Performance A',
                'guitar_workshop'       =>'Guitar Workshop',
                'woodwind_choir'        =>'Woodwind Choir',
                'harp_workshop'         =>'Harp Workshop',
                'multimedia_computing'  =>'Multimedia Computing (Computer Graphics)',
                'theatre_games'         =>'Theatre Games',
            ),
        ),
        'period_three_second' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => '',
            'comments'              => 'second choice',
            'options' => array(
                'composition'           =>'Composition',
                'elements_of_music'     =>'Elements of Music',
                'girls_vocal_ensemble'  =>'Girls Vocal Ensemble',
                'dance_2'               =>'Dance 2',
                'jazz_band_blue'        =>'Jazz Band Blue (or Jazz Class)',
                'mask_a'                =>'Mask Making A',
                'design_a'              =>'Process of Design A',
                'screenprint_a'         =>'Screenprinting A',
                'stop_motion_a'         =>'Stop Motion Animation A',
                'percussion_ensemble_a' =>'Percussion Ensemble A',
                'keyboard_workshop_a'   =>'Keyboard Workshop A',
                'vocal_performance_a'   =>'Vocal Performance A',
                'guitar_workshop'       =>'Guitar Workshop',
                'woodwind_choir'        =>'Woodwind Choir',
                'harp_workshop'         =>'Harp Workshop',
                'multimedia_computing'  =>'Multimedia Computing (Computer Graphics)',
                'theatre_games'         =>'Theatre Games',
            ),
        ),
        'period_four_first' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => 'Period 4 – 1:00-2:00',
            'comments'              => 'first choice',
            'options' => array(
                'orchestra'             =>'Orchestra (1:00-2:30; Strings-periods 1 & 5 also)',
                'flute_choir'           =>'Flute Choir',
                'jazz_band_white'       =>'Jazz Band White (or Jazz Class)',
                'mask_b'                =>'Mask Making B',
                'design_b'              =>'Process of Design B',
                'screenprint_b'         =>'Screenprinting B',
                'stop_motion_b'         =>'Stop Motion Animation B',
                'percussion_ensemble_b' =>'Percussion Ensemble B',
                'keyboard_workshop_b'   =>'Keyboard Workshop B',
                'vocal_performance_b'   =>'Vocal Performance B',
                'brass_choir'           =>'Brass Choir',
                'enjoyment_of_music'    =>'Enjoyment of Music',
                'electronic_music'      =>'Electronic Music',
            ),
        ),
        'period_four_second' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => '',
            'comments'              => 'second choice',
            'options' => array(
                //'orchestra'             =>'Orchestra (1:00-2:30; Strings-periods 1 & 5 also)',
                'flute_choir'           =>'Flute Choir',
                'jazz_band_white'       =>'Jazz Band White (or Jazz Class)',
                'mask_b'                =>'Mask Making B',
                'design_b'              =>'Process of Design B',
                'screenprint_b'         =>'Screenprinting B',
                'stop_motion_b'         =>'Stop Motion Animation B',
                'percussion_ensemble_b' =>'Percussion Ensemble B',
                'keyboard_workshop_b'   =>'Keyboard Workshop B',
                'vocal_performance_b'   =>'Vocal Performance B',
                'brass_choir'           =>'Brass Choir',
                'enjoyment_of_music'    =>'Enjoyment of Music',
                'electronic_music'      =>'Electronic Music',
            ),
        ),
        'period_five' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => 'Period 5 – 2:45-4:00',
            'options' => array(
                'orchestra'     =>'Orchestra String Sectionals (with periods 1 & 4)',
                'concert_band'  =>'Concert Band (with period 1)',
                'dance_3'       =>'Dance 3',
            ),
        ),
        'period_six' => array(
            'type'                  => 'select_no_sort',
            'add_null_value_to_top' => true,
            'display_name'          => 'Period 6 – 4:15-5:30',
            'options' => array(
                'choir' =>'Choir (with period 2)',
            ),
        ),
    );


    // style up the form and add comments et al
    function on_every_time()
    {
        $this->box_class = 'StackedBox';
        $this->change_element_type('band_instrument', 'select_no_sort', array('options' => $this->band_instruments_array));
        $this->change_element_type('orchestra_instrument', 'select_no_sort', array('options' => $this->orchestra_instruments_array));
        $this->change_element_type('jazz_instrument', 'select_no_sort', array('options' => $this->jazz_band_instruments_array));
        $this->change_element_type('wind_choir_instrument', 'select_no_sort', array('options' => $this->woodwind_choir_instruments_array));
        $this->change_element_type('brass_choir_instrument', 'select_no_sort', array('options' => $this->brass_choir_instruments_array));
        $this->change_element_type('lesson_instrument_1', 'select_no_sort', array('options' => $this->lesson_instruments_array));
        $this->change_element_type('lesson_instrument_2', 'select_no_sort', array('options' => $this->lesson_instruments_array));
    }

    function pre_show_form()
    {
        echo '<div id="campForm" class="pageTwo">'."\n";
    }
    function post_show_form()
    {
        echo '</div>'."\n";
    }

    function  run_error_checks()
    {
            //check orchestra requirements
        if (($this->get_value('period_one') == 'orchestra') || ($this->get_value('period_four_first') == 'orchestra') || ($this->get_value('period_five') == 'orchestra')){
            if (($this->get_value('period_one') != 'orchestra') || ($this->get_value('period_four_first') != 'orchestra') || ($this->get_value('period_five') != 'orchestra')){
                $this->set_error('period_one', 'Orchestra requires periods 1, 4 and 5.');
            }
        }
            //check concert band requirements
        if(($this->get_value('period_one') == 'concert_band') || ($this->get_value('period_five') == 'concert_band')){
            if(($this->get_value('period_one') != 'concert_band') || ($this->get_value('period_five') != 'concert_band')){
                $this->set_error('period_one', 'Conert Band requires periods 1 and 5.');
            }
        }
            //check choir requirements
        if(($this->get_value('period_two') == 'choir') || ($this->get_value('period_six') == 'choir')){
            if(($this->get_value('period_two') != 'choir') || ($this->get_value('period_six') != 'choir' )){
                $this->set_error('period_two', 'Choir requires periods 2 and 6.');
            }
        }
    }
}
?>