# TODO

## Top priorities

1. 2D wimstart (working):
	* Messaging is available and ready to be wired up as needed (based on UI and/or logic)
	* Infoboxes are not implemented  (Can we push this after the UI/CMS/Logic part?)
	* Revolving "compass" indicator  (Can we push this after the UI/CMS/Logic part?)
2. 3D wimstart (working):
	* Messaging is available and ready to be wired up as needed (based on UI and/or logic)
	* Offsets - will mostly likely require additional morph targets (I assume this can be pushed to later stage)
	* Opacity - intersecting blades don't blend correctly (I assume this can be pushed to later stage)
	* Orbit control - here we need to be aware that if 3D wimstart orbiting is enabled, 2D wimstart can't receive pointer (mouse/touch) events. So there are 2 options:
		* move all or some controls to WF page - so the controls that need to overlay 2D and 3D wimstart will be on the top, partially covering wimstars
		* toggle orbit option on/off - we already have such a toggle button in my metawim example now
		* or combination of above 2 options
	* Accuracy on best "time-effort" basis 
3. CMS:
	* I suggest using AWS now. It might take a day or 2 to finalize existing code but will be solid and won't need additional patching and WF workarounds
4. Syncing messages between platforms
	* Messaging is available among all 3 platforms and ready to be wired up as needed (based on UI and/or logic)
5. MetaWIM (UI)
	* I haven't seen your live WF page (can you please share the link to page or WF project?) but from what you have mentioned and judging by the clip, I would rather rebuild the mockup myself due to complexity, sizing and performance concerns. It should not take too much time as I won't bother with the styling at this stage. That can be appended later.
6. Logic
	* Free "wim-ing" - OK (From my perspective this is just an input/output algorithm. Even though it can become complex, it is still I/O script that we can tweak and polish once the all parts are setup)
	* Predefined tracks - same as above but with preset states and guidance layer
	* At this stage it is hard to comment how exactly we produce user experience but will have more suggestions once the UI/CMS is set up. The general idea is the same as we discussed earlier: we collect all inputs, build an array of parameters that will serve as a "decision" matrix for outputs (metawim and wimstart states). This I/O script can be then hooked to respective UI views:
		* Results will be populated to wimstars and metawim views
		* I assume the logic builder view for defining parameters will be available only to "admin". I already have one version of logic builder designed in the AWS page so most likely will enhance that to meet the final requirements.
7. SlideIn columns
	* part of UI
	* nav options will interact with all/some platforms (PP/PC/WF)
8. Precondition (Bias settings)
	* part of UI
	* controls will interact with all/some platforms (PP/PC/WF) 9. Global Settings
	* Will need to create new PP scene for that
10. Final design polish
	* TBD


### Info#1

1. 2D wimstar(editing platform) working
2. 3D wimstar working Except offsets
3. CMS (AWS or wf?) - Decide based on estimated scope - AWS existing...if slovakia regenerates the MetaWIM structure...should it be WF or AWS?
4. Syncing messages between platforms...conveying the feel of one WIM spec evolving...and visualized within multiple uniforms
5. MetaWIM - Estimate scope. Decision whether to remake. Sweden has a WF cms structure and UX done...non optimal coding/performance...will turn out problematic due to sluggishness and limited possibility for expanding Items etc (rebuild)
6. Logic - Degree of implementing for proto. Goal is 3 preset user tracks with possible deviations plus a “free mode” with (semi?) random results. Defined a strategy of simple predefined ̈tracks ̈with limited deviations throughout the process. feedback...or Proposal for a simple v1 proto logic? Proposal sent with this doc.
7. The slideIN columns holding nav buttons for triggering sections. Part of this is the IMPORt slide in page... Not a priority atm. Brief Sent
8. Preconditions. Brief sent.
9. Final design polish and fine-tune actions/messages between sections

### Info#2 - See [PDF specs](https://www.dropbox.com/s/dc1uc23r5lnqtxj/MetaWIMbrief2.pdf?dl=0) and [Screencast](https://www.dropbox.com/s/dn4mkjeo52vtmgq/metaWIMpage.mov?dl=0)

* page (WF, metawim) ...but the MetaWIM is an integral part of the full landscape...we need to decide you you can replicate my MetaWIM fairly easily. The biggest problem with my setup is that it is not optimized in terms of weight...the design stretches Items, Collections to limits causing friction of performance , expansion etc....
	* Slide in columns
	* Preconditions - Based on 2D wimstar, adding extra dials and sliders. Benchmarking slider/dropdowns. Define yourself and your preconditions
	* WIMshop (Sweden) - mainly for show, possibly define a connection to cms Add extra elements. Assign external resources
* PP/WF: The 2D version(or rather the Global Setting page definition of) the angling along Z(or Y I think in your world).
	* Showing ZY plane, user may drag shapes to define Z axis blade angles
	* Set macro criteria at kick off. Resolution for various areas of blades. We dont do this per blade but rather by 4 groups sop that adjacent blades adapt similar levels of resolution


* Complete message sync between platforms
	* Seamless experience across the landscape of pages and platforms. This means it is more important to finalize a shallow functional multi screen/platform experience
than creating a deeper, accurate, elaborate and sophisticated prototype at the cost of not conveying the holistic landscape.
	* The most important factor is to produce a fairly seamless experience moving across the 2D Wimstar, 3D Wimstar and MetaWIM...this is the most profound
workflow...the user will edit in 2D wimstar, review concrete results in MetaWIM, glance at 3D wimstar and then tweak settings in global Settings and preferences
etc...before exporting to final WIMspec and move on....




* Define the exact strategy for limited logic(need your input here)…simply put I need to set up 3 person based workflows, possible to replicate step by step(a guiding process)
	* The one correct path for each of these should have 4 alternative deviations…at least at some of the steps , to allow us to demonstrate alternative (less optimal )paths 
	* Then there is “free swimming” …if no logic strategy at all here the user will just be served random content.
	* Logic is absolutely desirable...but if the level of logic we wish for is not possible within scope, we rely on ̈3 user tracks where the app hints towards next
step(preferably through some type of intelligent process recognizing the current global status...if possible)....or at the lowest level we offer a text based step by step description that we assume the user will execute perfectly. The polarized landscape of sophistication sits between credible Logic and a manual text based guiding process...and in between there is a ̈status-aware ̈inherent guiding process that recognizes current state and advises next step according to a preset path
	* MetaWIM - 3 separate user tracks; 3 same structure sections: WHY, WHAT, HOW; 16 (blade) sections; Plus various content sections - Full specification including mapping of abstract to concrete (SWEDEN, Possibly regenerated by slovakia)
	* WIMSpec - Same content as MetaWIM in a more comprehensive design, deeper content...; Complete comprehensive presentation ready for export (SWEDEN, Possibly regenerated by slovakia) 



* Accuracy at any touch point is really not a priority...put it this way, it is more important there is a logical functional landscape that functions as a whole...meaning for example if >I go from 2D wimstar to 3D wimstar the synchronized profile is fairly well executed...(for example here we may leave out the off set functionality for 3D wimstar if this is too complex atm). Discrepancies between the exact scaling of blades etc and consistent updating across 2D wimstr, 3D wimstar and metawim is not absolutely crucial...again it is the
overall experience ...a fluid workflow balancing circles and moving sliders , dials ...and revising an instant MetaWIM specification...this is the overall target.


* Cms/cms sync according to my sketch
	* CMS I have produced a WF cms for the MetaWIM spec (and another for final WIMspec...this one will live autonomously) 


## Page

* DO: page - flexible size with locked aspect ratio
* DO: page - perimeter/circular string of 16 buttons a bit lower to provide more space for WIMstar.
* DO: page - There are now a vertical stack of buttons to the left and to the right. They are activated/slide in by tapping/clicking a rounded half circle button lett and right.
* DO: page - [PDF attached](https://www.dropbox.com/s/hpqyos3lq7gf2ux/wim201.pdf?dl=0) + [notes#1](nfo/wim-page-specs_notes-1.pdf) + [notes#2](nfo/wim-page-specs_notes-2.pdf) and a link to [demo clip](https://www.dropbox.com/s/zgpkjwaujsubmnd/wim222.mov?dl=0) where I click around in a very rough draft but still animated. I assume we can update icons and labels at the very end.
* DO: page cms - [PDF attached](nfo/wim-page-specs_cms-1.pdf) describing cms content structure and the links needed from cms to separate sections. Filters needed. Use AWS instead of WF if failing at currect temp (WF) setup.
* DO: page - There are other dedicated screens added to the main screen 3D(WIMstar/2D WIMstar)…these include 
	1. (pp)- the GLOBAL SETTINGS screen for defining a low level settings utilizing content in a `hidden Y axis` space basically determining the area in which the Blades should be angled along Y axis. I assume you would some more info on the Global settings interface…the 45 degree rotation of XY space into Z space…and the exact interaction made by user as he shapes (by dragging corners) of the semi transparent green area indicating the boundaries defining what blades oof the 16 in total that will be available for angling along Z. Again, this is what the global setting page is meant for: to establish a low level purpose for the wim session and indicate what type of goal and market sector we want to achieve…and this will be set by defining an area (or both let and right areas) that are available for angling Blades along Z. And angling along Z means defining the level of impact made to certain characteristics, probably mainly Disruption level (blades available to go full left or right….in future revision s the user would be able to select unique variables to visualize by the angles along Z…but for now I think the distance the blade may be angled will indicate level of disruption with one of the 16 blades(representing a specific characteristic of the final spec).
	2. the BIAS screen providing additional controls by shrinking the size of the WIMstar.
	3. There are additional screens not visualized in this doc…I am currently working on final content for these.
* DO: page - “core” paths to follow leading up to a final WIM…to facilitate this I have set up the A B C buttons bottom right. By reading a description of 3 user cases and following a preset path the user will understand options and key functionality. Then ideally we will support a few deviating paths that will call up alternative content by affecting dials sliders along the way. The important thing is to present the full scope of possibilities and a some type of cool UX …I think having a couple preset “perfect” scenarios plus som “headroom” offering a couple alternative elements along the way a goo approach
* DO: page - Having a series of predefined global states selected via a list/dropdown (the iPhone stuff etc)



## ProtoPie

### DO:

* DO: pp infoboxes: As another side note here s a clip from back in the Fall…a demo I did with a  soft overlay of a cloud of small pink circles with an icon and a metric attached. These would represent the actual content elements/characteristics used to produce our formula…in this clip we see how they update as they are pushed around by the various scaling of geometry inside the wim landscape. This is a cool metaphor or illustration for how the actual content is updated by our *sculpting* process as we balance our circles…
* DO: pp - Also here …in the early seconds of the clip is an idea for a simple circle revolving (like a compass calibrating) around the center core of the PP landscape. It has one text indicator( like a North bearing) ..says TECH. This feature could smth like a uber global indicator of what is the ultimate profile of the current state….could say Tech or Profit or Juvenile or what ever…This *compass* could be something to implement too. In general the more transparent (but not obtrusive/cluttering) overlay info we can provide, the bigger the  underlying machinery at work the user will sense. We might want to implement this too as an additional option to fade in via a slider transparency thing. BUT this just a heads up …just stay with your core mission atm. See: https://www.dropbox.com/s/12nkuhkpl11jhu3/globe.mp4?dl=0

### DONE:

* DONE: pp - run pp connect in cloud

### TBD:

* pp (not needed anymore) mini window/representation of the WIMstar at all times when editing in PP - The  “mini window”/heads up display of the PC WIMstar inside PP edit mode … and vice versa.. the PP universe mini window heads up inside PC WIMstar mode….continuosly updated. This is a wish for item too…not crucial, and it does require functionality described below:
* pp - Finally when it all works, we should look at adding beauty to the blades..if at all possible in PC…meaning the kind of render effects available in some game engines, eg. Shadows, lighting effects, outlines …this is definitely the last add on …if it is bought to produce beautiful realtime shading in PC I am fine with just having this interactivity working as it is..totally awesome. Wish for transparency tho.


## Play Canvas

### DO:

* DO: pc - global offset slider (see: [globe-offset-opacity](nfo/pc_globe-offset-opacity.mov) or https://www.dropbox.com/s/12nkuhkpl11jhu3/globe.mp4?dl=0 at 0:22). Looking for correct solution but for now we could set this up so the offset - which essentially is a skewed version of a centered profile - will be visualized by the centered version. Meaning we will have the 2D version signaling all correct scalings including offset,  but the (otherwise still synchronized) 3D version will not adapt to offsets … but still show synchronized core and tip scaling.
* DO: pc - blades transparency and blending (feel: https://www.youtube.com/watch?v=2N66nmEZiH8). Now we we are setting depth manually for each blades via this.meshInstance.calculateSortDistance callback. It solves the problem partialy and failing when blades intersects, i.e. when higher depth blades is rotated behind lower depth blade or vice-versa. Test with lookAt and reverseLooktAt (https://playcanvas.com/editor/code/678321?tabs=29887007,29886994) to solve transparency depth issue (this won't work. we need solve the case when 2 blades intersect)
* DO: pc - "beauty factor" like https://www.youtube.com/watch?v=2N66nmEZiH8&t=1s

### DONE:

* DONE: pc - umbrella effect (Y folding of blades)
* DONE: pc - blades' axis with label: 3 axises xyz as super thin hardly noticeable hairlines see attached , these should be permanently linked to the blades meaning they orbit with the global blade structure, they are not linked to a static xyz space. These axises will help indicate which blade is what. These axises would have a (dynamic) floating label attached to each end of axis.
* DONE (review): pc - floating labels (PC, PP), http://phone.playcanvas.com/ 
* DONE (review): pc - static transparency sphere to indicate global world and picking blades reflection (transpSphere.png). See https://www.dropbox.com/s/zoh4i24aa4m4rny/transpSphere.png?dl=0
* DONE: model orbit/rotation drag
* DONE: receive and execute commands from outside
* DONE: fade slider: 
Now that we are able to layer PP and PC like this…is it possible to have a seamless transition between PC 3D model and PP 2D universe by dragging a slider? If so user could set a desired level of duality at any stage of the creative process. This would also replace the need the “mini viewer setup? I suggested earlier. And super great if we could even separate the PP landscape into two entities and have one slider control opacity of the circular center section/Universe…and another control opacity of the control dials surrounding it. This would allow user to fade away the PP universe/circles and still use PP controls to edit…both PPand PC would be affected but you would only see the live effect on PC. And then user could go one step further and “fade away ” the visibility of PP controls as well…and be left with a clean PC 3D model which can be orbited against a white canvas…while having floating labels providing info/metrics.

### TBD:

* pc - A final note for inspiration …inside the transition between various states…example would be a transitin as we benchmark between active wimsrtar and an alternative profile…that transition could either just happen seamlessly with blade set adopting new profile or we could experiment with adding a brief *intermediate* color FX…something similar to attached link ...would help a smooth transition. Again this is only food for thought atm. See https://www.dropbox.com/s/l826s1lrsc9sclr/blobcolor.mp4?dl=0


### Next steps
In the next steps I think the focus will be on the WF page with PP/PC embeds and PP-PC states mapping.


## WF-PP-PC

### idea 

See https://www.dropbox.com/s/gl29xzsssnmjmuz/PP%20embedINwebflowAndWIMstar.mov?dl=0

### key points

There’s two elements I want to highlight …that maybe can be realized at least to some extent. 

1. (A) the general relationship we discussed between PP 2D geometry and PC 3D geometry…ideally these are completely linked, propagating both ways(PP reflects PC and vice versa) ...able to synchronize continuously. Meaning the WIMstar sliders( see below item B) will be an always active modeling tool.
2. (B) WIMstar macros…meaning (WF)sliders impacting current WIMstar profile pushing global profile(all 16 Blades towards certain global macros (iPhone etc)  …ideally this should also impact the PP 2D version(not crucial tho if this reverse pipeline is complex)

It just hit me that you already have this sliders/macros ability implemented as PC sliders. Maybe it is pretty easy to replicate( at least some of)  these sliders in WF. One simpler scenario could be that we offer 4 WF sliders as macros, driving all 16 PC sliders towards a limited set of macros. This would for example allow us to offer one slider driving the parameter "product design” (ie. Driving a set of  PC sliders towards an iPhone design. And another WF slider of 4 in total, driving a set of PC sliders towards a macro representing "engineering design”