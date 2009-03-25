<?php

/* Magpie RSS Feed display functions
 * 
 * @author Matthew Bockol
 * @package None
 * @version .001
 * @date 02.28.2006
 *
 * These functions allow for the parsing and display of RSS feeds using the Magpie RSS library
 * It's currently written to directly read files generated by Planet feed aggregation software ( http://www.planetplanet.org )
 * The get_feed_list function relies on access to and specific changes to the planet software's config.ini file.
 *
 * Usage: 
 *
 *      $string = display_carlplanet ( $mode="feed" )   // available modes:
 *                                                      //      feed -- show the full title and truncated description seperated by dates
 *                                                      //      nav -- show the full title onlye
 *                                                      //      search -- show just the search form
 *
 *      $string = generate_navigation ($current_page , $view_page , $search_url ) // generates previous, page number, next navigation
 *
 *      $string = generate_search ()    // generates search form
 *
 *      $string = html_safe_truncate ( $count_limit = 10 , $original_string , $href ) // truncates descriptions without breaking text mid-HTML tag
 *
 *      $string = parse_pubdate($orig_date="") // converts RSS feed's pubdate field into something more human readable
 * 
 *      $string = display_feed_list() // generates a list of participating feeds in alphabetical order
 *
 *      $associative_array = get_feed_list() // reads the planet software's config.ini file and returns an array of feed_title => feed_parent_url elements
 *
 */



include_once(CARL_UTIL_INC . 'tidy/tidy.php');
//define('MAGPIE_DEBUG',0);
//define('MAGPIE_DIR', MAGPIERSS_INC);
//define('DESCRIPTION_CHAR_LIMIT', '40');
//define('STORY_PER_PAGE', '20');
//define('PLANET_CONFIG_FILE', WEB_PATH . 'planets/carlplanet/config.ini'); 
//define('PLANET_RSS_FILE', WEB_PATH . 'planets/carlplanet/rss20.xml'); 

// magpie fails to detect UTF-8, we force it. 
define('MAGPIE_OUTPUT_ENCODING', 'UTF-8');
//define('MAGPIE_INPUT_ENCODING', 'UTF-8');
//define('MAGPIE_DETECT_ENCODING', false);

//define('MAGPIE_CACHE_ON', false);
//define('MAGPIE_CACHE_DIR', '/tmp/magpie_cache');

require_once(MAGPIERSS_INC . 'rss_fetch.inc');
require_once(MAGPIERSS_INC . 'rss_parse.inc');

class reasonFeedDisplay
{
	var $description_char_limit = 40;
	var $story_per_page = 20;
	var $_feed_location;
	var $_feed_is_remote = true;
	var $_search_string = '';
	var $_page = 1;
	var $_search_url;
	var $_page_query_string_key = 'view_page';
	var $_search_query_string_key = 'search';
	var $_show_descriptions = true;
    var $_display_timestamp = false ; 
	
	function set_location($location, $remote = true)
	{
		$this->_feed_location = $location;
		$this->_feed_is_remote = $remote;
	}

    function set_cache_disable($disabled = false)
    {
        if($disabled == true)
        {
            define('MAGPIE_CACHE_ON', false);
        }
    }

    function set_display_timestamp($show_timestamp = false)
    {
        if($show_timestamp == true)
        {
            $this->_display_timestamp = true ; 
        }
    }
	
	function set_search_string($search_string)
	{
		$this->_search_string = $search_string;

  	  	if($this->_search_string != '')
   		{
    		$this->_search_url = '&'.$this->_search_query_string_key.'='.urlencode($this->_search_string);
    	}
    	else
    	{
    		$this->_search_url = '';
    	}
	}
	
	function set_page($page)
	{
		if(!is_numeric($page) || $page < 1)
		{
			$page = 1;
		}
		$this->_page = $page;
	}
	
	function set_page_query_string_key($key)
	{
		$this->_page_query_string_key = $key;
	}
	function set_search_query_string_key($key)
	{
		$this->_search_query_string_key = $key;
	}
	function show_descriptions()
	{
		$this->_show_descriptions = true;
	}
	function hide_descriptions()
	{
		$this->_show_descriptions = false;
	}
	function set_story_per_page($num)
	{
		if(is_numeric($num) || $num > 0)
		{
			$this->story_per_page = $num;
		}
		else
		{
			trigger_error('The number of stories per page must be set to an integer greater than 0');
		}
	}
	function set_description_char_limit($num)
	{
		if(is_numeric($num) || $num > 0)
		{
			$this->description_char_limit = $num;
		}
		else
		{
			trigger_error('The description character limit must be set to an integer greater than 0');
		}
	}

	function display_feed ( $mode="feed" )
	{
		$rss = $this->get_parsed_data();

    	// clear some variables
    	$output = '';               // the result of all our labor, concatenated together
    	$nav_block = '';            // where we store the previous , 1 , 2 , 3, next string
    	$content_block = '';        // contains the actual feed posts
    	$now = time();              // now is the time, sans morris day

    	$current_page = 1 ;                     // tracks which page a story item should appear on 
    	$item_count = 0 ;                       // tracks which item we're looking at per page ( 1 to $this->story_per_page )
    	$displayed_items = 0 ;                  // count of how many items that have been added to the final output in case there are 0 and we need an error msg.
		$new_entry_date = '';
    	$last_date = '';                        // tracks when a day has passed between feed items and we need to redisplay the date. 

    	// if we've got a valid feed, iterate over the items
    	if ( $rss and !$rss->ERROR)
    	{
	
    	    foreach ($rss->items as $item) {
               
            // yank basic info from the feed
            if(isset($item['dc']['creator'])){ $author = $item['dc']['creator']; } else { $author = ''; } 
            $date = isset($item['date_timestamp']) ? $item['date_timestamp'] : "";
           	
			$new_entry_date = '';
			if(!empty($item['pubdate']))
			{
            	$pub_date = $item['pubdate'];
            	$new_entry_date = $this->parse_pubdate($pub_date); 
			}

            if(isset($item['title'])){ $title = strip_tags($item['title']); } else { $title = ''; }
            if(isset($item['description'])){ $description = $item['description']; } else { $description = ''; }
            if(isset($item['link'])){ $href = strip_tags($item['link']); } else { $href = ''; }

            if($this->_display_timestamp)   
            {
                $pubdate_sans_zone = $pub_date ; 
                $pubdate_sans_zone = preg_replace('/\+.*/','', $pubdate_sans_zone);

                if(isset($item['title'])){ $title = strip_tags($item['title']) . " @ " . strip_tags($pubdate_sans_zone); } else { $title = ''; }
            }


 
            // limit to search term
            $search_match = 1 ; 
            if($this->_search_string != ''){
                $search_match = 0 ; 
                if(preg_match('/'.$this->_search_string.'/i' , $title)){ $search_match = 1 ; }
                if(preg_match('/'.$this->_search_string.'/i' , $description)){ $search_match = 1 ; }
                }
 
            // skip events in the future
            if(($date - $now) < 0 && $search_match && $title != '' && $description != '' && $href != ''){ 
           
                // keep track of which item/page we're on. 
                $item_count++ ; 
                if($item_count > $this->story_per_page){
                    $current_page++ ; 
                    $item_count = 1 ; 
                    }

                // add to nav block
                $nav_block .= '<li><a href="'.$href. '">';
                $nav_block .= $title . "</a></li>\n"; 

                // select which stories to display based on the page number they fall on and which page is selected. 
                if($this->_page == $current_page){

                    // Display new date
                    if(strcmp($new_entry_date,$last_date) != 0 )
					{ 
						if(!empty($last_date))
						{
							$content_block .= '</ul>';
						}
                        $content_block .= '<h3>'.$new_entry_date.'</h3><ul>'."\n"; 
                        $last_date = $new_entry_date ;
                    }
					elseif($item_count == 1)
					{
						$content_block .= '<ul>'."\n";
					}

                    // this is the most expensive part of the code, only do it if we're displaying the feed
                    if($mode == 'feed'){  
                        
						$content_block .= '<li><h4><a href="'.$href.'">'.$title.'</a></h4>'."\n";
                        // add to content block
						if($this->_show_descriptions)
						{
                       	 	$trun_description = $this->html_safe_truncate($this->description_char_limit , $description , $href); 
						 	$content_block .= '<div class="desc">'.$trun_description.'</div></li>'."\n";
						}
                        }
          
                    // keep track of how many items we've shown in case we need to let the user know there aren't any explicitly
                    $displayed_items++ ; 
 
                    } 
                }
            }
        $content_block .= "</ul>\n";
        }
    else {
        $output .= "Unable to process the feed: " . $rss->ERROR;
        }



    // the nav block is the list of available postings sans descriptions. The post links go to anchor tags in the main feed listing
    if($mode == 'nav'){
    	$output .= '<div id="rss_nav">'."\n";
        $output .= "<h4>Current Items</h4>\n";
        $output .= "<ul>\n"; 
        $output .= $nav_block ; 
        $output .= "</ul>\n";
        $output .= '</div>'."\n";
        }

    // the feed contains the full (description truncated) postings with links to the original articles
    if($mode == 'feed'){
        
        // compose page navigation
        $page_nav = $this->generate_navigation ($current_page , $this->_page , $this->_search_url );
        
        // let the user know if the search set is empty
        if($displayed_items == 0 && $this->_search_string != ''){ echo '<h3>No items match your query.</h3><p><a href="?">Clear search</a></p>'; }
       
        // display the feed itself 
        $output .= "<div id='rss_content'>\n"; 
        $output .= $page_nav ; 
        $output .= $content_block ; 

        if($this->_page > $current_page){ 
            $output .= '<h3>Requested page is not available</h3>';
            $output .= '<p><a href="?">Go to first page</a></p>';
            }


        $output .= $page_nav ; 
        $output .= "</div>\n"; 
    
        }

    return $output ; 

    }
	
	function get_parsed_data()
	{
		if($this->_feed_is_remote)
		{
			 $rss = fetch_rss($this->_feed_location);
		}
		else
		{
   			$rss_string = utf8_encode(file_get_contents($this->_feed_location));
    		$rss = new MagpieRSS( $rss_string );
   		}
		if(!empty($rss) && $rss && !$rss->ERROR)
		{
			return $rss;
		}
		else
		{
			trigger_error('Unable to parse feed: '.$this->_feed_location.'; Error: '.$rss->ERROR);
			return false;
		}
	}

// display previous , page numbers , next links
function generate_navigation ($current_page , $view_page , $search_url ) { 

    // compose page navigation
    $page_nav = ""; 

    if($current_page > 1){  // current_page is the last page seen by the parser above. we only need nav if there's more than one page to nav to.

        // set up the nav markup
        $page_nav .= '<div class="pagination">';

        // if we're on a page beyond the first, add the "previous link"
        if($view_page > 1){
            $page_nav .= '<a href="?'.$this->_page_query_string_key.'=' . ($view_page - 1) . $search_url . '" class="prev">Previous</a>'."\n";
            }

        // iterate over the available pages and display a link for each. highlight the current page
        for($page = 1 ; $page <= $current_page ; $page++){
            if($page == $view_page){
                $page_nav .= '<strong><a href="?'.$this->_page_query_string_key.'=' . $page . $search_url . '">'.$page.'</a></strong>'."\n";
                }
            else { 
                $page_nav .= '<a href="?'.$this->_page_query_string_key.'=' . $page . $search_url . '">'.$page.'</a>'."\n";
                }
            }
        
        // if we're on a page before the last available, add the "next link"
        if($view_page < $current_page ){
            $page_nav .= '<a href="?'.$this->_page_query_string_key.'=' . ($view_page + 1) . $search_url . '" class="next">Next</a>'."\n";
            }
      
        // close out the nav markup
        $page_nav .= "</div>\n"; 
 
        }

    return $page_nav ; 

    }


// form to query the feed
function generate_search (){

    $output = "";     
  	$search = '';
    if(isset($_REQUEST['search'])){ $search = $_REQUEST['search']; }

    $output .= '<form method="get" id="rss_search_form" action="?'.$this->_page_query_string_key.'=1">';
	$output .= 'Search Posts For: ';
    $output .= '<input type="text" id="rss_search_box" name="'.$this->_search_query_string_key.'" value="' . 
htmlspecialchars($search, ENT_QUOTES) . '" />';
    $output .= " <a href=\"javascript:document.getElementById('rss_search_form').submit()\" class=\"searchSubmitLink\">Go</a>";
	$output .= '<noscript><input type="submit" name="go" value="Go" /></noscript>';
	if(!empty($search))
	{
		$output .= ' <a href="?" class="searchSubmitLink">Clear Search</a>';
	}
    $output .= "</form>\n";

    return $output ; 

    }


// truncate the string with HTML based on the word count of the string with HTML stripped away.
function html_safe_truncate ( $count_limit = 10 , $original_string , $href ){

    $output = "";  // save our work

    // make sure our html is clean to begin with
    $original_string = trim(tidy($original_string));

    // make sure the parse doesn't confuse <a href="blah">foo for a single word (since it's splitting on spaces)
    $original_string = preg_replace('/\n/' , ' ', $original_string);
    $original_string = preg_replace('/>/' , '> ', $original_string);
    $original_string = preg_replace('/</' , ' <', $original_string);
    $original_string = preg_replace('/\s+/' , ' ', $original_string);

    // remove any HTML from the string
    $stripped_string = strip_tags($original_string);

    // remove any extra spaces between words
    $stripped_string = preg_replace('/\s+/' , ' ', $stripped_string);

    // split the string into an array
    $stripped_array = explode(' ', $stripped_string , $count_limit + 1);

    // truncate the stripped_array if it exceeds the count_limit, otherwise it's short enought already
    if(count($stripped_array) > $count_limit){
        unset($stripped_array[count($stripped_array)-1]);
        }

    // split the original_string into an array
    $original_array = explode(' ' , $original_string );

    // a counter to keep track of how many words in the stripped_array we've matched from the original array
    $stripped_counter = 0 ;

    while( $stripped_counter < count($stripped_array) ){

        foreach($original_array as $word){

            // if we haven't reached the count limit, echo the word
            if($stripped_counter < count($stripped_array) && $word != "" ){ $output .=  $word . " "; }

            // if the word in the original array matches a word from the stripped array, increment the counter
            if($word == $stripped_array[$stripped_counter]){ $stripped_counter++ ; }
           
            // escape this loop if we've reached the end of the stripped_array
            if($stripped_counter == count($stripped_array)){ break ; } 
            }
        }

    // compare the last 10 chars of the original string with the last 10 of the possibly truncated output.  If they match a truncation
    // probably hasn't happened and the "more" link isn't necessary.  If they don't match, add the more link.
    $more = ""; 
    if( strcmp(substr(trim($original_string), strlen(trim($original_string)) - 10 , 10), substr(trim($output), strlen(trim($output)) - 10 , 10))){ $more = " ... <a href=\"$href\">more</a>"; }
    $output .= $more ; 

    // one final pass through tidy
    return trim(tidy($output)) ;


    }

// planet software feed dates get prettyfied.
function parse_pubdate($orig_date=""){

    $date_fields = explode(' ', $orig_date); 

    $day = $date_fields[0]; 

    $month = $date_fields[2];

    if($day == "Sun,"){ $day = "Sunday"; }
    elseif($day == "Mon,"){ $day = "Monday"; }
    elseif($day == "Tue,"){ $day = "Tuesday"; }
    elseif($day == "Wed,"){ $day = "Wednesday"; }
    elseif($day == "Thu,"){ $day = "Thursday"; }
    elseif($day == "Fri,"){ $day = "Friday"; }
    elseif($day == "Sat,"){ $day = "Saturday"; }

    if($month == "Jan"){ $month = "01" ; }
    elseif($month == "Feb"){ $month = "02" ; }
    elseif($month == "Mar"){ $month = "03" ; }
    elseif($month == "Apr"){ $month = "04" ; }
    elseif($month == "May"){ $month = "05" ; }
    elseif($month == "Jun"){ $month = "06" ; }
    elseif($month == "Jul"){ $month = "07" ; }
    elseif($month == "Aug"){ $month = "08" ; }
    elseif($month == "Sep"){ $month = "09" ; }
    elseif($month == "Oct"){ $month = "10" ; }
    elseif($month == "Nov"){ $month = "11" ; }
    elseif($month == "Dec"){ $month = "12" ; }

    return $day . " " . $month . "/" . $date_fields[1] . "/" . $date_fields[3] ; 

    }

}

?>
