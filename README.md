Usage
==
OPTIONS LISTING:
`
    *transferMode               - the type of transfer to perform on items (see heading TRANSFER MODES)
    *sortBy                     - the attribute to use when sorting items (values: 'text' or 'value')
    *useFilters                 - allow the filtering of items in either box (true/false)
    *useCounters                - use the visible/total counters (true/false)
    *useSorting                 - sort items after executing a transfer (true/false)
    *selectOnSubmit             - select items in box 2 when the form is submitted (true/false)
`
All options have default values, and as such, are optional.  Check the 'settings' JSON object below to see the defaults.

TRANSFER MODES:
`
    * 'move' - In this mode, items will be removed from the box in which they currently reside and moved to the other box. This is the default.
    * 'copy' - In this mode, items in box 1 will ALWAYS remain in box 1 (unless they are hidden by filtering).  When they are selected for transfer
               they will be copied to box 2 and will be given the class 'copiedOption' in box 1 (my default styling for this class is yellow background
               but you may choose whatever styling suits you).  If they are then transferred from box 2, they disappear from box 2, and the 'copiedOption'
               class is removed from the corresponding option in box 1.
`

Legal
==
Developed by Justin Mead
Copyright (c) 2011 MeadMiracle
www.meadmiracle.com / meadmiracle@gmail.com
Licensed under the MIT License http://opensource.org/licenses/MIT

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

As this Dual Listbox jQuery Plug-in was initially released with GPL v2 License which was quite restrictive, I got the following explicit permission 
to release it under MIT License from the original author and copyright holder.
From: Justin Mead <xxxxxxxxxxx@gmail.com>
Date: December 19, 2012, 4:11:28 PM PST
To: Parvez <xxxxxxxxxxx@gmail.com>
Cc: web@meadmiracle.com
Subject: Re: Dual Listbox jQuery Plug-in
Happy to help!  You have my permission to release my code under the MIT license.  Good luck with your project!
Justin
