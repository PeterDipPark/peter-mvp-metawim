# TODO


## Page

* DO: page - flexible size with locked aspect ratio
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

* DO: pc - global offset slider (see: [globe-offset-opacity](nfo/pc_globe-offset-opacity.mov) or https://www.dropbox.com/s/12nkuhkpl11jhu3/globe.mp4?dl=0 at 0:22) 
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