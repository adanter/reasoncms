 /* ------------------------------------------------------------------
  * GEM - Graphics Environment for Multimedia
  *
  *  Copyright (c) 2002 IOhannes m zmoelnig. forum::für::umläute. IEM
  *	zmoelnig@iem.kug.ac.at
  *  For information on usage and redistribution, and for a DISCLAIMER
  *  OF ALL WARRANTIES, see the file, "GEM.LICENSE.TERMS"
  *
  *  this file has been generated...
  * ------------------------------------------------------------------
  */

#ifndef INCLUDE_GEM_GLTEXCOORD3S_H_
#define INCLUDE_GEM_GLTEXCOORD3S_H_

#include "GemGLBase.h"

/*
 CLASS
	GEMglTexCoord3s
 KEYWORDS
	openGL	0
 DESCRIPTION
	wrapper for the openGL-function
	"glTexCoord3s( GLshort s, GLshort t, GLshort r)"
 */

class GEM_EXTERN GEMglTexCoord3s : public GemGLBase
{
	CPPEXTERN_HEADER(GEMglTexCoord3s, GemGLBase);

	public:
	  // Constructor
	  GEMglTexCoord3s (t_float, t_float, t_float);	// CON

	protected:
	  // Destructor
	  virtual ~GEMglTexCoord3s ();
	  // Do the rendering
	  virtual void	render (GemState *state);

	// variables
	  GLshort	s;		// VAR
	  virtual void	sMess(t_float);	// FUN

	  GLshort	t;		// VAR
	  virtual void	tMess(t_float);	// FUN

	  GLshort	r;		// VAR
	  virtual void	rMess(t_float);	// FUN


	private:

	// we need some inlets
	  t_inlet *m_inlet[3];

	// static member functions
	  static void	 sMessCallback (void*, t_floatarg);
	  static void	 tMessCallback (void*, t_floatarg);
	  static void	 rMessCallback (void*, t_floatarg);
};
#endif // for header file